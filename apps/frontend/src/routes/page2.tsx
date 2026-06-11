import { Link } from "react-router";
import { Container, Typography, Box, Paper, Button } from "@mui/material";

export default function Page2() {
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
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Page 2 Demo
        </Typography>
        <Typography variant="body1" color="text.secondary" component="p" sx={{ mb: 2 }}>
          This route showcases React Router v7 Framework Mode transition. You are browsing a client-side route without any server round-trip.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Button variant="outlined" component={Link} to="/" color="primary">
            Go Back Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
