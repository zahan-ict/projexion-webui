import { useState, useEffect, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Stack,
  IconButton,
  Paper,
  Snackbar,
  Alert,
  List,
  ListItem,
  InputAdornment,
  Switch,
  Autocomplete,
  Fade
} from '@mui/material';
import { Delete, Edit, Close, Visibility, VisibilityOff, VisibilityOutlined } from '@mui/icons-material';
import Ribbon from '../../common/Ribbon';
import CircularProgress from '@mui/material/CircularProgress';
import { useAxiosInstance } from '../Auth/AxiosProvider';
import CustomPagination from '../../components/CustomPagination'
import FormattedDateTime from '../../components/FormattedDateTime'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

const User = () => {
  const { axiosInstance } = useAxiosInstance();
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rowToDeleteId, setRowToDeleteId] = useState(null);



  /*###################################### Load All Data On Page Load #######################################*/

  const [dataLoading, setDataLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const [rowCount, setRowCount] = useState(0);

  const fetchData = useCallback(async ({ page, pageSize }) => {
    if (pageSize <= 0) return; // Ensure pageSize is always > 0
    setDataLoading(true);
    try {
      const response = await axiosInstance.get(`/users/paging?pageIndex=${page}&pageSize=${pageSize}`);
      const { data, totalCount } = response.data;
      if (data && data.length > 0) {
        setRows(data);
        setRowCount(totalCount); // Assuming API returns total count
        // setRowCount(16);
      } else {
        setRows([]);
        setRowCount(0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setDataLoading(false);
    }
  }, [axiosInstance]);

  useEffect(() => {
    // Fetch data on component mount
    fetchData(paginationModel);
  }, [fetchData, paginationModel]);

  const handlePaginationModelChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };

  const columns = [
    {
      field: 'userFirstName',
      headerName: 'Name',
      renderHeader: () => <strong>Name</strong>,
      width: 270,
      renderCell: (params) => (
        <Typography style={{ fontSize: '14px' }} >{params.value}</Typography>
      ),
    },

    {
      field: 'userEmail',
      headerName: 'Email',
      renderHeader: () => <strong>Email</strong>,
      width: 270,
      renderCell: (params) => (
        <Typography style={{ fontSize: '14px' }} >{params.value}</Typography>
      ),
    },

    {
      field: 'userRoles',
      headerName: 'Roles',
      renderHeader: () => <strong>Roles</strong>,
      width: 200,
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center">
          {params.value}
        </Stack>
      ),
    },
    {
      field: "validUntil",
      headerName: "Validity",
      renderHeader: () => <strong>Validity</strong>,
      width: 220,
      renderCell: (params) => {
        const value = params.value ? new Date(params.value) : null;
        const now = new Date();

        // Helper: format date nicely (e.g., October 07, 2025)
        const formatDate = (date) => {
          if (!date) return "Unlimited";
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          });
        };

        // Helper: calculate difference
        const getExpiryText = (date) => {
          if (!date) return "(no expiry)";
          const diffMs = date - now;
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

          if (diffDays <= 0) return "Expired";
          if (diffDays < 30) return `Expires in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
          if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `Expires in ${months} month${months > 1 ? "s" : ""}`;
          } else {
            const years = Math.floor(diffDays / 365);
            return `Expires in ${years} year${years > 1 ? "s" : ""}`;
          }
        };

        const expiryText = getExpiryText(value);
        const isExpiringSoon = value && (value - now) / (1000 * 60 * 60 * 24) < 30;

        return (
          <Stack direction="column" alignItems="flex-start">
            <Typography
              style={{
                fontSize: "14px",
                fontWeight: isExpiringSoon ? "bold" : "normal",
                color: isExpiringSoon ? "#000" : "inherit",
              }}
            >
              {formatDate(value)}
            </Typography>
            <Typography
              style={{
                fontSize: "12px",
                color: isExpiringSoon ? "red" : "gray",
                fontWeight: isExpiringSoon ? "bold" : "normal",
              }}
            >
              {expiryText}
            </Typography>
          </Stack>
        );
      },
    },

    {
      field: 'lastLogin',
      headerName: 'Last Seen',
      renderHeader: () => <strong>Last Seen</strong>, 
      width: 180,
      flex: 1,
      renderCell: (params) => {
        const formatRelativeTime = (dateString) => {
          if (!dateString) return 'Never';

          const date = new Date(dateString);
          const now = new Date();
          const diffMs = now - date;
          const diffSec = Math.floor(diffMs / 1000);
          const diffMin = Math.floor(diffSec / 60);
          const diffHrs = Math.floor(diffMin / 60);
          const diffDays = Math.floor(diffHrs / 24);
          const diffMonths = Math.floor(diffDays / 30);
          const diffYears = Math.floor(diffDays / 365);

          if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
          if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
          if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
          if (diffHrs > 0) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
          if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
          return 'Just now';
        };

        return (
          <Stack direction="row" alignItems="center">
            <Typography style={{ fontSize: '14px' }}>
              {formatRelativeTime(params.value)}
            </Typography>
          </Stack>
        );
      },
    },

    {
      field: "isActive",
      headerName: "Active",
      renderHeader: () => <strong>Active</strong>,
      flex: 1,
      renderCell: (params) => {
        const handleToggle = async (event) => {
          const newValue = event.target.checked;
          try {
            await axiosInstance.put(`users/${params.row.id}`, {
              isActive: newValue,
            });
            // Update local DataGrid data immediately
            setRows((prevRows) =>
              prevRows.map((row) =>
                row.id === params.row.id ? { ...row, isActive: newValue } : row
              )
            );

          } catch (error) {
            console.error("Failed to update status:", error);
          }
        };

        return (
          <Stack direction="row" alignItems="center">
            <Typography style={{ fontSize: "14px", marginRight: "8px" }}>
              {/* {params.value ? "Active" : "Inactive"} */}
            </Typography>
            <Switch
              checked={Boolean(params.value)}
              onChange={handleToggle}
              color="success"
            />
          </Stack>
        );
      },
    },

    // { field: 'userPass', headerName: 'Password', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      renderHeader: () => <strong>Actions</strong>,
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={() => { openDetailsDialog(params.row) }} color="secondary" size="large" aria-label="view"> <VisibilityOutlined fontSize='inherit' /></IconButton>
          <IconButton onClick={() => { openDialog(params.row) }} color="secondary" size="medium" aria-label="view"><Edit fontSize='inherit' /></IconButton>
          <IconButton onClick={() => { openDeleteDialog(params.id) }} color="secondary" size="medium" aria-label="view"><Delete fontSize='inherit' /></IconButton>
        </Stack>
      ),
    },
  ];

  /*###################################### Delete User #######################################*/

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const handleDeleteRow = async (id) => {
    try {
      const idToDelete = rowToDeleteId;

      if (idToDelete !== null) {
        const updatedRows = rows.filter((row) => row.id !== idToDelete);
        await axiosInstance.delete(`/users/${idToDelete}`);
        setRows(updatedRows);
        closeDeleteDialog();
      }
    } catch (error) {
      console.error('Error deleting row:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const openDeleteDialog = (id) => {
    setRowToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setRowToDeleteId(null);
    setIsDeleteDialogOpen(false);
  };


  /*###################################### On change event #######################################*/
  const [formData, setFormData] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear the specific field error when the user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };


  /*###################################### Valid form #######################################*/
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    if (!formData.userFirstName) newErrors.userFirstName = 'Profile Name is required';

    // Email validation (required + format)
    if (!formData.userEmail) {
      newErrors.userEmail = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.userEmail)) {
        newErrors.userEmail = 'Enter a valid email address';
      }
    }

    if (!formData.userPass) newErrors.userPass = 'Password is required';
    if (!formData.userRoles) newErrors.userRole = 'Role is required';  // Ensure role selection
    return newErrors;
  };



  /*###################################### Add User #######################################*/
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
  };


  const addUser = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axiosInstance.post('/users/', formData);

        // If backend returns 409, show error inside email textbox
        if (response.data === 409) {
          setErrors((prev) => ({
            ...prev,
            userEmail: 'Email address already exists',
          }));
        } else {
          fetchData(paginationModel);
          setOpen(true); // show success message
          resetUser();
          closeAddDialog();
        }
      } catch (error) {
        console.error('Error adding user:', error);

        // If server explicitly returns HTTP 409
        if (error.response && error.response.status === 409) {
          setErrors((prev) => ({
            ...prev,
            userEmail: 'Email address already exists',
          }));
        } else {
          // For any other unexpected error
          setErrors((prev) => ({
            ...prev,
            userEmail: 'Failed to add user due to an error' + error.response.status + '. Please try again.',
          }));
        }
      }
    } else {
      setErrors(formErrors);
    }
  };



  /* ####################################### Role List ######################################*/
  const [roles, setRoles] = useState([]);

  const handleSelectedRole = (event, newValue) => {
    setFormData({ ...formData, userRoles: newValue ? newValue.label : '' });

    // Clear the specific field error when the user starts typing
    setErrors((prevErrors) => ({
      userRoles: '',
    }));
  };


  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get('/roles/role-name');
      const data = response.data;
      const roleData = Object.keys(data).map((key) => ({
        label: key,
        value: data[key]  // assuming the value is the branch ID or similar
      }));
      setRoles(roleData);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };


  /*###################################### Update User #######################################*/
  const updateUser = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const updatedRows = rows.map((row) =>
          row.id === selectedRow.id ? { ...row, ...formData } : row,
        );
        await axiosInstance.put(`/users/${formData.id}`, formData);
        setRows(updatedRows);
        setOpen(true); // Show Success Message
        closeDialog();
      } catch (error) {
        console.log(error);
      }
    } else {
      setErrors(formErrors);
    }
  };

  const openDialog = (rowData) => {
    setSelectedRow(rowData || null);
    setFormData(rowData || {});
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedRow(null);
    setFormData({});
    setIsDialogOpen(false);
  };


  /*###################################### Close Alert #######################################*/
  const [open, setOpen] = useState(false);
  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  /*###################################### Reset User #######################################*/
  const resetUser = () => {
    setFormData({
      userName: '',
      userEmail: '',
      userPass: '',
      userRole: '',
    });
    setErrors({});
  };

  /*###################################### Show User Details #######################################*/
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [rowDetails, setRowDetails] = useState({});

  const openDetailsDialog = (rowData) => {
    setSelectedRow(rowData || null);
    setRowDetails(rowData);
    setIsDetailsDialogOpen(true);
  };

  const closeDetailsDialog = () => {
    setSelectedRow(null);
    setRowDetails({});
    setIsDetailsDialogOpen(false);
  };


  /*###################################### Password Field Control #######################################*/
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  /*###################################### Map coloum name is details dialog #######################################*/
  const keyNameMapping = {
    userFirstName: 'Frist Name',
    userLastName: 'Last Name',
    userEmail: 'Email',
    userMobile: 'Mobile',
    isActive: 'Is Active',
    isVerified: 'Is Verified',
    validUntil: 'Access Till',
    lastLogin: 'Last Seen',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
  };

  /*###################################### Content Start #######################################*/
  return (
    <Box>
      <Ribbon
        addElement={(openAddDialog)}
        handleExport={""}
        refreshElement={() => fetchData(paginationModel)}
        route={"user"} />

      <Dialog open={isAddDialogOpen}
        onClose={closeAddDialog}
        maxWidth="md"
        closeAfterTransition={true}
        disableRestoreFocus>
        <DialogTitle>Add User</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={closeAddDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: "GrayText"
          }}>
          <Close />
        </IconButton>

        <DialogContent>
          <TextField
            name="userFirstName"
            value={formData.userFirstName || ''}
            onChange={handleChange}
            required
            fullWidth
            id="userFirstName"
            label="Name"
            error={!!errors.userFirstName}
            helperText={errors.userFirstName}
            autoFocus
          />
          <TextField
            name="userEmail"
            value={formData.userEmail || ''}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            id="userEmail"
            label="Email"
            error={!!errors.userEmail}
            helperText={errors.userEmail}
          />

          <TextField
            fullWidth
            name="userPass"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.userPass || ''}
            onChange={handleChange}
            margin="normal"
            error={!!errors.userPass}
            helperText={errors.userPass}

            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Role Selection */}
          <Autocomplete
            options={roles}
            getOptionLabel={(option) => option.label}
            value={roles.find(option => option.label === formData.userRoles) || null}
            onChange={handleSelectedRole}
            onFocus={fetchRoles}
            renderInput={(params) => (
              <TextField
                {...params}
                name="userRole"
                label="Roles"
                margin="dense"
                fullWidth
                error={!!errors.userRole}
                helperText={errors.userRole}
              />
            )}
          />

        </DialogContent>
        <DialogActions sx={{ pl: 3, pb: 2, mt: 0 }}>
          <Button onClick={closeAddDialog} aria-label="close" color="secondary" variant="outlined" sx={{ ml: 2 }}>Cancle</Button>
          <Button onClick={resetUser} sx={{ ml: 2 }} color="primary" variant="outlined">Reset</Button>
          <Button onClick={addUser} variant="contained" color="primary" sx={{ mr: 2 }}>Add USER</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={open}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={closeSnackbar}
      >
        <Alert
          onClose={closeSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}>
          User Save Successfully
        </Alert></Snackbar>
      {/* Server side paging */}
      <Paper sx={{ transition: 'height 0.3s ease' }}>
        <Fade in={!dataLoading} timeout={400}>
          <div>
            <DataGrid
              rows={rows}
              columns={columns}
              rowCount={rowCount}                // total rows from backend
              paginationMode="server"            // enable server-side pagination
              paginationModel={paginationModel}  // controlled pagination state
              onPaginationModelChange={handlePaginationModelChange}

              pageSizeOptions={[20, 50, 100]}    // user can change pageSize
              // checkboxSelection
              disableSelectionOnClick
              hideFooterSelectedRowCount
              autoHeight
              getRowHeight={() => 65}
              loading={dataLoading}
              loadingOverlay={<div className="Data-Loader"><CircularProgress /></div>}
              onCellClick={(params, event) => {
                if (params.field !== '__check__') {
                  event.stopPropagation();
                }
              }}
              slots={{ pagination: CustomPagination }}
            />
          </div>
        </Fade>
      </Paper>

      <Dialog open={isDialogOpen}
        closeAfterTransition={true}

        disableRestoreFocus
        onClose={closeDialog}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>

          <Box sx={{ mt: 1 }}>
            {/* 1Role Selection */}
            <Typography backgroundColor="#000" color="white" sx={{ mb: 1, maxWidth: 200, borderRadius: 1, py: 0.5, px: 1, }}>
              Active Role: {formData.userRoles || 'N/A'}
            </Typography>
            {/* Validity Date */}
            <Typography
              backgroundColor="#000"
              color="white"
              sx={{ mt: 2, mb: 1, maxWidth: 300, px: 1, py: 0.5, borderRadius: 1 }}
            >
              Active Validity:{' '}
              {formData.validUntil
                ? new Date(formData.validUntil).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: '2-digit',
                })
                : 'N/A'}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Autocomplete
                options={roles}
                getOptionLabel={(option) => option.label}
                value={roles.find((option) => option.label === formData.userRoles) || null}
                onChange={handleSelectedRole}
                onFocus={fetchRoles}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="userRole"
                    label="Roles"
                    margin="normal"
                    fullWidth
                    error={!!errors.userRole}
                    helperText={errors.userRole}
                  />
                )}
              />
            </Box>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Valid Until"
                inputFormat="MM/dd/yyyy"
                value={formData.validUntil ? new Date(formData.validUntil) : null}
                onChange={(newValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    validUntil: newValue ? newValue.toISOString() : null,
                  }))
                }
                renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
              />
            </LocalizationProvider>

          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog} variant="outlined">Cancel</Button>
          <Button onClick={updateUser} variant="contained" color="secondary">
            Update
          </Button>
        </DialogActions>
      </Dialog >

      <Dialog open={isDetailsDialogOpen}
        onClose={closeDetailsDialog}
        closeAfterTransition={true}
        disableRestoreFocus
        fullWidth
      >
        <DialogTitle>User Details</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={closeDetailsDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: "GrayText"
          }}>
          <Close />
        </IconButton>

        <DialogContent>

          <List>
            {Object.entries(rowDetails)
              .filter(([key]) =>
                !['id', 'passwordRequestedAt', 'userPass', 'userSalt', 'userRoles'].includes(key)
              )
              .map(([key, value]) => {
                const displayKey = keyNameMapping[key] || key;
                const validValue = value !== undefined && value !== null ? value : 'N/A';

                const isDateField = [
                  'validUntil',
                  'createdAt',
                  'updatedAt',
                  'lastLogin'
                ].includes(key);

                return (
                  <ListItem key={key}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", minWidth: "140px" }}
                    >
                      {displayKey}:
                    </Typography>

                    {isDateField ? (
                      <Typography variant="body2">
                        <FormattedDateTime value={validValue} />
                      </Typography>
                    ) : (
                      <Typography variant="body2">{String(validValue)}</Typography>
                    )}
                  </ListItem>
                );
              })}
          </List>

        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetailsDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        closeAfterTransition={true}
        disableRestoreFocus
        onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography> Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteRow} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box >
  );
};

export default User