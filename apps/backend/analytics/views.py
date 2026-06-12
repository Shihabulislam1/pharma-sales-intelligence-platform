from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count, F, Q, Avg, Min
from sales.models import PharmacySalesFact
from django.conf import settings

class KPIDashboardView(APIView):
    def get(self, request):
        qs = PharmacySalesFact.objects.all()
        kpis = qs.aggregate(
            total_revenue=Sum('revenue', default=0),
            total_units_sold=Sum('units_sold', default=0),
            total_stock_value=Sum(F('stock_level') * F('unit_price'), default=0),
            total_medicines=Count('medicine', distinct=True),
            total_countries=Count('country', distinct=True),
            total_regions=Count('region', distinct=True),
        )
        return Response(kpis)

class RevenueAnalyticsView(APIView):
    def get(self, request):
        group_by = request.query_params.get('group_by', 'region')
        valid_groups = ['region', 'country', 'category', 'medicine', 'age_group', 'month']
        
        if group_by not in valid_groups:
            return Response({"error": "Invalid group_by parameter"}, status=400)
            
        data = PharmacySalesFact.objects.values(group_by).annotate(
            revenue=Sum('revenue', default=0),
            units_sold=Sum('units_sold', default=0)
        ).order_by('-revenue')
        
        return Response({
            "group_by": group_by,
            "data": list(data)
        })

class InventoryAnalyticsView(APIView):
    def get(self, request):
        view = request.query_params.get('view', 'summary')
        
        try:
            threshold = int(request.query_params.get('threshold', getattr(settings, 'INVENTORY_LOW_STOCK_THRESHOLD', 500)))
        except ValueError:
            return Response({"error": "threshold must be an integer"}, status=400)
            
        if view == 'low_stock':
            data = PharmacySalesFact.objects.values('medicine', 'category').annotate(
                inventory_value=Sum(F('stock_level') * F('unit_price'), default=0),
                stock_level=Avg('stock_level', default=0)
            ).filter(stock_level__lte=threshold).order_by('stock_level')
        elif view == 'overstock':
            over_threshold = int(request.query_params.get('threshold', getattr(settings, 'INVENTORY_OVERSTOCK_THRESHOLD', 4500)))
            data = PharmacySalesFact.objects.values('medicine', 'category').annotate(
                inventory_value=Sum(F('stock_level') * F('unit_price'), default=0),
                stock_level=Avg('stock_level', default=0)
            ).filter(stock_level__gte=over_threshold).order_by('-stock_level')
        elif view == 'by_category':
            data = PharmacySalesFact.objects.values('category').annotate(
                inventory_value=Sum(F('stock_level') * F('unit_price'), default=0),
                stock_level=Sum('stock_level', default=0)
            ).order_by('-inventory_value')
        else: # summary
            data = PharmacySalesFact.objects.values('medicine', 'category').annotate(
                inventory_value=Sum(F('stock_level') * F('unit_price'), default=0),
                stock_level=Avg('stock_level', default=0)
            ).order_by('medicine')
            
        return Response({
            "view": view,
            "threshold": threshold,
            "data": list(data)
        })

class ExpiryAnalyticsView(APIView):
    def get(self, request):
        try:
            days = int(request.query_params.get('days', 30))
        except ValueError:
            return Response({"error": "days must be an integer"}, status=400)
            
        at_risk_qs = PharmacySalesFact.objects.filter(expiry_days_remaining__lte=days)
        
        summary = at_risk_qs.aggregate(
            total_at_risk_records=Count('id'),
            total_at_risk_value=Sum(F('stock_level') * F('unit_price'), default=0)
        )
        
        by_category = at_risk_qs.values('category').annotate(
            count=Count('id'),
            inventory_value=Sum(F('stock_level') * F('unit_price'), default=0),
            stock_level=Sum('stock_level', default=0),
            min_expiry_days=Min('expiry_days_remaining')
        ).order_by('-inventory_value')
        
        by_medicine = at_risk_qs.values('medicine').annotate(
            count=Count('id'),
            inventory_value=Sum(F('stock_level') * F('unit_price'), default=0),
            stock_level=Sum('stock_level', default=0),
            min_expiry_days=Min('expiry_days_remaining')
        ).order_by('-inventory_value')
        
        return Response({
            "expiry_within_days": days,
            "total_at_risk_records": summary['total_at_risk_records'],
            "total_at_risk_value": summary['total_at_risk_value'],
            "by_category": list(by_category),
            "by_medicine": list(by_medicine)
        })

class DemographicAnalyticsView(APIView):
    def get(self, request):
        data = PharmacySalesFact.objects.values('age_group').annotate(
            units_sold=Sum('units_sold', default=0),
            revenue=Sum('revenue', default=0)
        ).order_by('-revenue')
        
        return Response({
            "data": list(data)
        })

class CovidAnalyticsView(APIView):
    def get(self, request):
        group_by = request.query_params.get('group_by', 'overall')
        valid_groups = ['overall', 'region', 'category']
        
        if group_by not in valid_groups:
            return Response({"error": "Invalid group_by parameter"}, status=400)
            
        if group_by == 'overall':
            data = PharmacySalesFact.objects.values('covid_flag').annotate(
                revenue=Sum('revenue', default=0),
                units_sold=Sum('units_sold', default=0)
            )
            
            # Format nicely for Recharts
            formatted = []
            for item in data:
                formatted.append({
                    "period": "COVID-19 Period" if item['covid_flag'] else "Non-COVID Period",
                    "revenue": item['revenue'],
                    "units_sold": item['units_sold']
                })
                
            return Response({
                "group_by": group_by,
                "data": formatted
            })
        else:
            base_data = PharmacySalesFact.objects.values(group_by, 'covid_flag').annotate(
                revenue=Sum('revenue', default=0),
                units_sold=Sum('units_sold', default=0)
            )
            
            pivoted = {}
            for item in base_data:
                key = item[group_by]
                if key not in pivoted:
                    pivoted[key] = {
                        group_by: key,
                        "covid_revenue": 0,
                        "non_covid_revenue": 0,
                        "covid_units_sold": 0,
                        "non_covid_units_sold": 0,
                    }
                
                prefix = "covid_" if item['covid_flag'] else "non_covid_"
                pivoted[key][f"{prefix}revenue"] = item['revenue']
                pivoted[key][f"{prefix}units_sold"] = item['units_sold']
                
            return Response({
                "group_by": group_by,
                "data": list(pivoted.values())
            })
