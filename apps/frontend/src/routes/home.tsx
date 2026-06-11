import { Link } from "react-router";
import { Container, Typography, Box, Button, Paper, Alert, CircularProgress } from "@mui/material";
import { useGetHeartbeatQuery } from "../app/api/pharmaApi";

export default function Home() {
  const { data, error, isLoading, refetch } = useGetHeartbeatQuery();

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          background: "rgba(24, 24, 27, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Pharma Sales Intelligence
        </Typography>
        <Typography variant="body1" color="text.secondary" component="p" sx={{ mb: 2 }}>
          Welcome to your newly configured Nx + Django + React Vite workspace running in **React Router v7 Framework Mode** and backed by **Redux Toolkit Query (RTK Query)**.
        </Typography>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            RTK Query Heartbeat Test
          </Typography>
          {isLoading && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CircularProgress size={24} />
              <Typography variant="body2">Checking backend connection...</Typography>
            </Box>
          )}
          {error && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Could not connect to Django backend. Ensure both servers are running (e.g., via <code>./dev.sh</code>).
            </Alert>
          )}
          {data && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Success! Backend Heartbeat Status: <strong>{data.status}</strong>
            </Alert>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => refetch()}
            disabled={isLoading}
            sx={{ mt: 1 }}
          >
            Test Connection
          </Button>
        </Box>

        <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <Typography variant="body2" color="text.secondary">
            Navigate to:{" "}
            <Link to="/page-2" style={{ color: "#06b6d4", textDecoration: "none" }}>
              Page 2 Demo
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
