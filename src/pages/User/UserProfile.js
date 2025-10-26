import { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Button,
  Typography,
  Grid,
  Paper,
  Divider,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { useAxiosInstance } from "../Auth/AxiosProvider";
import { styled } from "@mui/material/styles";
import { Person, Visibility, VisibilityOff } from "@mui/icons-material";

// ---------------- Sidebar and Layout Styles ----------------
const Sidebar = styled(Paper)(({ theme }) => ({
  width: 220,
  height: "100%",
  borderRadius: 0,
  boxShadow: "none",
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
}));

// ---------------- Component ----------------
const UserProfilePage = () => {
  const { axiosInstance } = useAxiosInstance();
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState(null);

  // ---------------- Fetch User Info ----------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedEmail = sessionStorage.getItem("userEmail");
        if (!storedEmail) {
          console.warn("No user email found in session storage");
          return;
        }

        const response = await axiosInstance.get("/users", {
          params: { email: storedEmail },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };

    fetchUser();
  }, [axiosInstance]);

  const FormattedDateTime = ({ value }) => {
    if (!value) return "N/A";
    const date = new Date(value);
    return date.toLocaleString("de-DE", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleTabChange = (_, newValue) => setTabValue(newValue);

  // ---------------- Password Update Logic ----------------
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updating, setUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordUpdate = async () => {
    setErrorMsg(""); // reset error message

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setErrorMsg("⚠️ Bitte füllen Sie alle Passwortfelder aus.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMsg("⚠️ Neues Passwort und Bestätigung stimmen nicht überein!");
      return;
    }

    setUpdating(true);
    try {
      const email = sessionStorage.getItem("userEmail");
      if (!email) {
        setErrorMsg("⚠️ Sitzung abgelaufen. Bitte erneut anmelden.");
        return;
      }

      const response = await axiosInstance.put("/users/update-password", {
        email,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.status === 200) {
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        alert("✅ Passwort erfolgreich aktualisiert!");
      } else {
        setErrorMsg("⚠️ Fehler beim Aktualisieren des Passworts.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setErrorMsg(error.response?.data?.message || "❌ Passwort konnte nicht geändert werden!");
    } finally {
      setUpdating(false);
    }
  };

  // ---------------- Loading / No Data ----------------
  if (!user)
    return (
      <Typography p={4} color="text.secondary">
        Benutzerinformationen werden geladen...
      </Typography>
    );

  // ---------------- Render ----------------
  return (
    <Box display="flex" height="80vh" bgcolor="#fafafa" margin={4}>
      {/* Sidebar */}
      <Sidebar>
        <Tabs
          orientation="vertical"
          value={tabValue}
          onChange={handleTabChange}
          sx={{ height: "100%", paddingTop: 2 }}
        >
          <Tab label="Profil" />
          <Tab label="Sicherheit" />
        </Tabs>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        {/* ---------------- Profile Tab ---------------- */}
        {tabValue === 0 && (
          <>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Persönliche Informationen
            </Typography>
            <Box display="flex" alignItems="center" gap={3} mb={4}>
              <Avatar
                src={user.profileImage || ""}
                alt={user.userFirstName}
                sx={{ width: 90, height: 90 }}
              >
                <Person />
              </Avatar>
              <Typography variant="h6">{user.userFirstName || "Benutzer"}</Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                  Vorname
                </Typography>
                <TextField
                  fullWidth
                  value={user.userFirstName || ""}
                  InputProps={{ readOnly: true }}
                  sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                  E-Mail
                </Typography>
                <TextField
                  fullWidth
                  value={user.userEmail || ""}
                  InputProps={{ readOnly: true }}
                  sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                  Mobilnummer
                </Typography>
                <TextField
                  fullWidth
                  value={user.userMobile || "N/A"}
                  InputProps={{ readOnly: true }}
                  sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                  Rolle
                </Typography>
                <TextField
                  fullWidth
                  value={user.userRoles || "N/A"}
                  InputProps={{ readOnly: true }}
                  sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ mt: 10, mb: 2 }} />
            <Typography variant="subtitle2" color="text.secondary">
              Gültig bis: <FormattedDateTime value={user.validUntil} />
            </Typography>
          </>
        )}

        {/* ---------------- Security Tab ---------------- */}
        {tabValue === 1 && (
          <>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Passwort ändern
            </Typography>
            <Typography color="text.secondary" mb={4}>
              Denken Sie daran: Ihr Passwort ist Ihr digitaler Schlüssel zu Ihrem Konto. Bewahren Sie es sicher auf!
            </Typography>

            {errorMsg && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errorMsg}
              </Alert>
            )}

            <Grid container spacing={3} mb={5}>
              {/* Aktuelles Passwort */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                  Aktuelles Passwort
                </Typography>
                <TextField
                  fullWidth
                  name="currentPassword"
                  type={showPassword.currentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility("currentPassword")}
                          edge="end"
                        >
                          {showPassword.currentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
                />
              </Grid>

              {/* Neues Passwort */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                  Neues Passwort
                </Typography>
                <TextField
                  fullWidth
                  name="newPassword"
                  type={showPassword.newPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility("newPassword")}
                          edge="end"
                        >
                          {showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
                />
              </Grid>

              {/* Neues Passwort bestätigen */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                  Neues Passwort bestätigen
                </Typography>
                <TextField
                  fullWidth
                  name="confirmPassword"
                  type={showPassword.confirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility("confirmPassword")}
                          edge="end"
                        >
                          {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="secondary"
                sx={{ borderRadius: 2, px: 4 }}
                disabled={updating}
                onClick={handlePasswordUpdate}
              >
                {updating ? "Aktualisieren..." : "Passwort aktualisieren"}
              </Button>
            </Box>
          </>
        )}
      </MainContent>
    </Box>
  );
};

export default UserProfilePage;
