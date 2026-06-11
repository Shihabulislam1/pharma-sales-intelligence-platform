import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Provider } from "react-redux";
import { ThemeProvider, createTheme, StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "./app/store";

// Create a premium Material UI Theme
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4f46e5", // Indigo
    },
    secondary: {
      main: "#06b6d4", // Cyan
    },
    background: {
      default: "#09090b", // Zinc 950
      paper: "#18181b", // Zinc 900
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "sans-serif"',
  },
});

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <StyledEngineProvider enableCssLayer>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </Provider>
        </StyledEngineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
