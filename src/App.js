import RouteList from './routes/AppRoutes'
import { ThemeProvider } from "@mui/material/styles";
import theme from './theme/theme';
import './theme/style.css'
import { AuthProvider } from './pages/Auth/AuthProvider';
import { AxiosProvider } from './pages/Auth/AxiosProvider';
import { LanguageProvider } from './language/LanguageContext';
import { SearchProvider } from './common/SearchContext';

const App = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider theme={theme}>
          <AxiosProvider>
            <SearchProvider>
              <RouteList />
            </SearchProvider>
          </AxiosProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
