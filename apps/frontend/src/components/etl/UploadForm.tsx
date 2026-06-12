import { useState } from 'react';
import { Button, Card, CardContent, CircularProgress, Typography, Alert } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useUploadCsvMutation } from '../../store/api';

export function UploadForm() {
  const [uploadCsv, { isLoading, isSuccess, isError }] = useUploadCsvMutation();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await uploadCsv(formData).unwrap();
      setFile(null);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <Card>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 2, px: 4, py: 2 }}
        >
          Select CSV File
          <input type="file" hidden accept=".csv" onChange={handleFileChange} />
        </Button>
        {file && (
          <Typography variant="body1" sx={{ mb: 3 }}>
            Selected: {file.name}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || isLoading}
          sx={{ px: 4, py: 1.5 }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Upload and Process'}
        </Button>

        {isSuccess && (
          <Alert severity="success" sx={{ mt: 3, width: '100%' }}>
            File uploaded and ETL pipeline triggered successfully!
          </Alert>
        )}
        {isError && (
          <Alert severity="error" sx={{ mt: 3, width: '100%' }}>
            Failed to upload file. Please check the format and try again.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
