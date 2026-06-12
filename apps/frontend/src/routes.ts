import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("./components/Layout.tsx", [
    index("./routes/index.tsx"),
    route("upload", "./routes/upload.tsx"),
    route("etl", "./routes/etl.tsx"),
    route("analytics/revenue", "./routes/analytics/revenue.tsx"),
    route("analytics/inventory", "./routes/analytics/inventory.tsx"),
    route("analytics/expiry", "./routes/analytics/expiry.tsx"),
    route("analytics/demographics", "./routes/analytics/demographics.tsx"),
    route("analytics/covid", "./routes/analytics/covid.tsx"),
  ])
] satisfies RouteConfig;
