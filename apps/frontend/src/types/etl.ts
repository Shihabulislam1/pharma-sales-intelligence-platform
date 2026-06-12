export interface ETLJobResponse {
  id: number;
  file_name: string;
  uploaded_at: string;
  total_rows: number | null;
  valid_rows: number | null;
  invalid_rows: number | null;
  duplicates_removed: number | null;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  notes: string | null;
  cloudinary_url: string | null;
}
