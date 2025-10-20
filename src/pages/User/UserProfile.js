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
  TextField
} from "@mui/material";
import { useAxiosInstance } from "../Auth/AxiosProvider";
import { styled } from "@mui/material/styles";
import {
  Person
} from '@mui/icons-material';

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

const UserProfilePage = () => {
  const { axiosInstance } = useAxiosInstance();
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const email = "zahan.link@gmail.com";
        const response = await axiosInstance.get("/users", { params: { email } });
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
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleTabChange = (_, newValue) => setTabValue(newValue);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirmation do not match!");
      return;
    }
    try {
      await axiosInstance.put("/users/update-password", {
        email: user.userEmail,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password!");
    }
  };

  if (!user) return <Typography p={4}>Loading...</Typography>;

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
          <Tab label="Profile" />
          <Tab label="Security" />
          {/* <Tab label="Notification" />
          <Tab label="Billing" />
          <Tab label="Integration" /> */}
        </Tabs>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        {/* Profile Tab */}
        {tabValue === 0 && (
          <>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Personal information
            </Typography>
            <Box display="flex" alignItems="center" gap={3} mb={4}>
              <Avatar

                src={user.profileImage || ""}
                alt={user.userFirstName}
                sx={{ width: 90, height: 90 }}
              >
                <Person />
                {/* {user.userFirstName?.[0]?.toUpperCase()} */}
              </Avatar>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                  First name
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
                  Email
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
                  Mobile
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
                  Role
                </Typography>
                <TextField
                  fullWidth
                  value={user.userRoles || "N/A"}
                  InputProps={{ readOnly: true }}
                  sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                  Verified
                </Typography>
                <TextField
                  fullWidth
                  value={user.isVerified ? "Yes" : "No"}
                  InputProps={{ readOnly: true }}
                  sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                  Status
                </Typography>
                <TextField
                  fullWidth
                  value={user.isActive ? "Active" : "Inactive"}
                  InputProps={{ readOnly: true }}
                  sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
                />
              </Grid>
            </Grid>
            <Divider sx={{ mt: 20, mb: 1 }} />


            <Typography variant="subtitle2" color="text.secondary">
              Valid Until: <FormattedDateTime value={user.validUntil} />
            </Typography>


          </>
        )}

        {/* Security Tab */}
        {tabValue === 1 && (
          <>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Password
            </Typography>
            <Typography color="text.secondary" mb={4}>
              Remember, your password is your digital key to your account. Keep it safe, keep it secure!
            </Typography>

            <Grid container spacing={3} mb={5}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                  Current password
                </Typography>
                <TextField
                  fullWidth
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                  New password
                </Typography>
                <TextField
                  fullWidth
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                  Confirm new password
                </Typography>
                <TextField
                  fullWidth
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
                />
              </Grid>
            </Grid>

            {/* <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="success"
                sx={{ borderRadius: 2, px: 4 }}
                onClick={handlePasswordUpdate}
              >
                Update
              </Button>
            </Box> */}
          </>
        )}
      </MainContent>
    </Box>
  );
};

export default UserProfilePage;
