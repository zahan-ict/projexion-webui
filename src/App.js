import RouteList from './routes/AppRoutes'
import { ThemeProvider } from "@mui/material/styles";
import theme from './theme/theme';
import './theme/style.css'
import { AuthProvider } from './pages/Auth/AuthProvider';
import { AxiosProvider } from './pages/Auth/AxiosProvider';
import { LanguageProvider } from './language/LanguageContext';

const App = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider theme={theme}>
          <AxiosProvider>
            <RouteList />
          </AxiosProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
