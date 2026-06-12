import { Card, CardContent, CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import type { ETLJobResponse } from '../../types/etl';

interface ETLHistoryTableProps {
  jobs?: ETLJobResponse[];
  isLoading: boolean;
  error: any;
}

function StatusChip({ status }: { status: ETLJobResponse['status'] }) {
  const color = status === 'COMPLETED' ? 'success' : status === 'FAILED' ? 'error' : 'warning';
  return <Chip label={status} color={color} size="small" />;
}

export function ETLHistoryTable({ jobs, isLoading, error }: ETLHistoryTableProps) {
  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading ETL History</Typography>;

  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>File Name</TableCell>
                <TableCell>Uploaded At</TableCell>
                <TableCell>Total Rows</TableCell>
                <TableCell>Valid Rows</TableCell>
                <TableCell>Duplicates</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs?.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.id}</TableCell>
                  <TableCell>{job.file_name}</TableCell>
                  <TableCell>{new Date(job.uploaded_at).toLocaleString()}</TableCell>
                  <TableCell>{job.total_rows ?? '-'}</TableCell>
                  <TableCell>{job.valid_rows ?? '-'}</TableCell>
                  <TableCell>{job.duplicates_removed ?? '-'}</TableCell>
                  <TableCell><StatusChip status={job.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
