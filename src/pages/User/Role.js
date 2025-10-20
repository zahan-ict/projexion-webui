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
  ListItemText,
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  Switch,
  Fade
} from '@mui/material';

import {
  Adjust,
  Delete,
  Close,
  Edit,
  VisibilityOutlined
} from '@mui/icons-material';

import Ribbon from '../../common/Ribbon';
import CircularProgress from '@mui/material/CircularProgress';
import { useAxiosInstance } from '../Auth/AxiosProvider';
import CustomPagination from '../../components/CustomPagination'


const Role = () => {
  const { axiosInstance } = useAxiosInstance();
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rowToDeleteId, setRowToDeleteId] = useState(null);
  const [showAddRole, setShowAddRole] = useState(false);
  const cancleRole = () => {
    setShowAddRole(!showAddRole);
  };

  /*###################################### Load All Data On Page Load #######################################*/
  const [dataLoading, setDataLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const [rowCount, setRowCount] = useState(0);
  const fetchData = useCallback(async ({ page, pageSize }) => {
    if (pageSize <= 0) return; // Ensure pageSize is always > 0
    setDataLoading(true);
    try {
      const response = await axiosInstance.get(`/roles/paging?pageIndex=${page}&pageSize=${pageSize}`);
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
      field: 'roleName',
      headerName: 'Role-Name',
      width: 270,
      renderCell: (params) => (
        <Typography style={{ fontSize: '14px' }} >{params.value}</Typography>
      ),
    },

    {
      field: 'roleDescription',
      headerName: 'Role-Description',
      width: 300,
      renderCell: (params) => {
        const value = params.value || '';
        const truncated = value.length > 20 ? `${value.substring(0, 20)}…` : value;
        return (
          <Typography style={{ fontSize: '14px' }}>
            {truncated}
          </Typography>
        );
      },
    },

    {
      field: "createdAt",
      headerName: "Created At",
      width: 220,
      flex: 1,
      renderCell: (params) => {
        const formatDateTime = (dateString) => {
          if (!dateString) return "";

          const date = new Date(dateString);

          // Format date: "October 06, 2025"
          const datePart = date.toLocaleDateString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric",
          });

          // Format time: "07:23 PM"
          const timePart = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          return { datePart, timePart };
        };

        const { datePart, timePart } = formatDateTime(params.value);

        return (
          <Stack direction="column">
            <Typography style={{ fontSize: "14px" }}>{datePart}</Typography>
            <Typography style={{ fontSize: "12px", color: "gray" }}>{timePart}</Typography>
          </Stack>
        );
      },
    },

    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 220,
      flex: 1,
      renderCell: (params) => {
        const formatDateTime = (dateString) => {
          if (!dateString) return "";

          const date = new Date(dateString);

          // Format date: "October 06, 2025"
          const datePart = date.toLocaleDateString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric",
          });

          // Format time: "07:23 PM"
          const timePart = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          return { datePart, timePart };
        };

        const { datePart, timePart } = formatDateTime(params.value);

        return (
          <Stack direction="column">
            <Typography style={{ fontSize: "14px" }}>{datePart}</Typography>
            <Typography style={{ fontSize: "12px", color: "gray" }}>{timePart}</Typography>
          </Stack>
        );
      },
    },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={3}>
          <IconButton onClick={() => openDetailsDialog(params.row)} color="secondary" size="medium" aria-label="view"> <VisibilityOutlined fontSize='inherit' /></IconButton>
          <IconButton onClick={() => openDialog(params.row)} color="secondary" size="medium" aria-label="view"><Edit fontSize='inherit' /></IconButton>
          <IconButton onClick={() => openDeleteDialog(params.id)} color="secondary" size="medium" aria-label="view"><Delete fontSize='inherit' /></IconButton>
        </Stack>
      ),
    },
  ];


  /*###################################### Delete Role #######################################*/

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const handleDeleteRow = async (id) => {
    try {
      const idToDelete = rowToDeleteId;

      if (idToDelete !== null) {
        const updatedRows = rows.filter((row) => row.id !== idToDelete);
        await axiosInstance.delete(`/roles/${idToDelete}`);
        setRows(updatedRows);
        closeDeleteDialog();
      }
    } catch (error) {
      console.error('Error deleting role:', error);
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
    if (!formData.roleName) newErrors.roleName = 'Role Name is required';
    return newErrors;
  };



  /*###################################### Add Role #######################################*/
  const saveRole = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        // Include rolePermission in the payload
        const payload = {
          ...formData,
          rolePermission, // include switches and option values
        };
        await axiosInstance.post(`/roles/`, payload);
        fetchData(paginationModel);
        setIsAddRoleDialogOpen(false);
        setOpen(true); // Show Success Message
        resetRole();
        cancleRole();

      } catch (error) {
        console.log(error);
      }
    } else {
      setErrors(formErrors);
    }
  };

  /*..........................Role Permission Payload ...............*/
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [rolePermission, setRolePermission] = useState({});
  const openAddRoleDialog = () => {
    setIsAddRoleDialogOpen(true);
    setFormData({ roleName: '', roleDescription: '' });

    // Fetch admin role permissions from backend
    axiosInstance.get('/roles/admin-role')
      .then(res => {
        const resourcesFromDB = res.data.rolePermission || {}; // get JSON permissions
        const defaultPerms = {};

        Object.keys(resourcesFromDB).forEach(r => {
          defaultPerms[r] = {
            read: resourcesFromDB[r].read || false,
            write: resourcesFromDB[r].write || false,
            option: resourcesFromDB[r].option || "" // add option field
          };
        });

        setRolePermission(defaultPerms);
      })
      .catch(err => console.error(err));
  };


  const closeAddRoleDialog = () => {
    setIsAddRoleDialogOpen(false);
  };


  const handlePermissionToggle = (resource, type) => {
    setRolePermission(prev => ({
      ...prev,
      [resource]: {
        ...prev[resource],
        [type]: !prev[resource][type],
      }
    }));
  };

  // Optional: handle option changes
  const handleOptionChange = (resource, value) => {
    setRolePermission(prev => ({
      ...prev,
      [resource]: {
        ...prev[resource],
        option: value
      }
    }));
  };


  /*###################################### Update Role #######################################*/
  const updateRole = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        // Combine form fields with permissions
        const updatedRole = {
          ...formData,
          rolePermission: rolePermission, // include updated permissions
        };

        // Send update to backend
        const response = await axiosInstance.put(`/roles/${selectedRow.id}`, updatedRole);

        // Update local table rows
        const updatedRows = rows.map((row) =>
          row.id === selectedRow.id ? response.data : row
        );

        setRows(updatedRows);
        setOpen(true); // success alert/snackbar
        closeDialog();
      } catch (error) {
        console.error('Error updating role:', error);
      }
    } else {
      setErrors(formErrors);
    }
  };


  const openDialog = (rowData) => {
    if (!rowData) return;
    setSelectedRow(rowData);
    setFormData({
      roleName: rowData.roleName || '',
      roleDescription: rowData.roleDescription || '',
      id: rowData.id
    });
    setIsDialogOpen(true);

    // Fetch role permissions from backend by ID
    axiosInstance.get(`/roles/${rowData.id}`)
      .then(res => {
        const resourcesFromDB = res.data.rolePermission || {}; // get JSON permissions
        const perms = {};

        Object.keys(resourcesFromDB).forEach(r => {
          perms[r] = {
            read: resourcesFromDB[r]?.read || false,
            write: resourcesFromDB[r]?.write || false,
            option: resourcesFromDB[r]?.option || "" // only Node may have option
          };
        });

        setRolePermission(perms);
      })
      .catch(err => console.error('Error fetching role permissions:', err));
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

  /*###################################### Reset Role #######################################*/
  const resetRole = () => {
    setFormData({
      roleName: '',
      roleDescription: ''
    });
    setErrors({});
  };

  /*###################################### Show Role Details #######################################*/
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const openDetailsDialog = (rowData) => {
    if (!rowData) return;
    setSelectedRow(rowData);
    setFormData({
      roleName: rowData.roleName || '',
      roleDescription: rowData.roleDescription || '',
      id: rowData.id
    });
    setIsDetailsDialogOpen(true);

    // Fetch role permissions from backend by ID
    axiosInstance.get(`/roles/${rowData.id}`)
      .then(res => {
        const resourcesFromDB = res.data.rolePermission || {}; // get JSON permissions
        const perms = {};

        Object.keys(resourcesFromDB).forEach(r => {
          perms[r] = {
            read: resourcesFromDB[r]?.read || false,
            write: resourcesFromDB[r]?.write || false,
            option: resourcesFromDB[r]?.option || "" // only Node may have option
          };
        });

        setRolePermission(perms);
      })
      .catch(err => console.error('Error fetching role permissions:', err));

  };

  const closeDetailsDialog = () => {
    setSelectedRow(null);
    setIsDetailsDialogOpen(false);
  };

  /*###################################### Start Page Element #######################################*/

  return (
    <Box>
      <Ribbon
        addElement={(openAddRoleDialog)}
        handleExport={""}
        refreshElement={() => fetchData(paginationModel)}
        route={"role"} />

      <Dialog
        open={isAddRoleDialogOpen}
        onClose={closeAddRoleDialog}
        closeAfterTransition={true}
        disableRestoreFocus
        fullWidth>
        <DialogTitle>Create Role</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={closeAddRoleDialog}
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
            name="roleName"
            value={formData.roleName || ''}
            onChange={handleChange}
            required
            fullWidth
            id="roleName"
            label="Role Name"
            error={!!errors.roleName}
            helperText={errors.roleName}
            autoFocus
          />

          <TextField
            fullWidth
            name="roleDescription"
            id="roleDescription"
            label="Role Description"
            value={formData.roleDescription || ''}
            onChange={handleChange}
            margin="normal"
          />

          <List sx={{ width: '100%', bgcolor: 'background.paper' }} subheader={<ListSubheader sx={{ fontSize: 18 }}>Resource Permissions:</ListSubheader>}>
            {Object.keys(rolePermission).map((resource, index, array) => (
              <ListItem
                key={resource}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: index !== array.length - 1 ? '1px solid #e0e0e0' : 'none', // gray line except last
                  py: .3
                }}
              >
                <ListItemIcon>
                  <Adjust />
                </ListItemIcon>

                <ListItemText primary={resource} sx={{ minWidth: 120 }} />

                {/* Option only for Node */}
                {resource === 'Node' && (
                  <TextField
                    size="small"
                    placeholder="Option"
                    value={rolePermission[resource].option || ""}
                    onChange={(e) => handleOptionChange(resource, e.target.value)}
                    sx={{ mr: 2, width: 100 }}
                  />
                )}

                {/* Read Switch */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 1 }}>
                  <Switch
                    edge="end"
                    checked={rolePermission[resource].read}
                    onChange={() => handlePermissionToggle(resource, 'read')}
                  />
                  <Typography variant="caption" color="text.secondary">Read</Typography>
                </Box>

                {/* Write Switch */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 1 }}>
                  <Switch
                    edge="end"
                    checked={rolePermission[resource].write}
                    onChange={() => handlePermissionToggle(resource, 'write')}
                  />
                  <Typography variant="caption" color="text.secondary">Write</Typography>
                </Box>
              </ListItem>
            ))}
          </List>

        </DialogContent>
        <DialogActions sx={{ pb: 2, mt: 0 }}>

          <Button onClick={closeAddRoleDialog} variant="outlined" color="secondary" sx={{ ml: 2 }}>Cancle</Button>
          <Button onClick={resetRole} variant="outlined" color="secondary" sx={{ ml: 2 }}>Reset</Button>
          <Button onClick={saveRole} variant="contained" color="secondary" sx={{ mr: 2 }}> Add Role </Button>
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
          Role Save Successfully
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
              pageSizeOptions={[10, 20, 100]}    // user can change pageSize
              checkboxSelection
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

      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        closeAfterTransition={true}
        disableRestoreFocus
       maxWidth="sm" fullWidth
      >
        <IconButton
          aria-label="close"
          onClick={closeDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: "GrayText"
          }}>
          <Close />
        </IconButton>
        <DialogTitle>Edit Role</DialogTitle>
        <DialogContent>
          <Box>
            <TextField
              name="roleName"
              value={formData.roleName || ''}
              onChange={handleChange}
              required
              fullWidth
              id="roleName"
              label="Role Name"
              error={!!errors.roleName}
              helperText={errors.roleName}
              margin="normal"
              autoFocus
            />

            <TextField
              fullWidth
              name="roleDescription"
              id="roleDescription"
              label="Role Description"
              value={formData.roleDescription || ''}
              onChange={handleChange}
              margin="normal"
            />
            <List
              sx={{ width: '100%', bgcolor: 'background.paper' }}
              subheader={<ListSubheader sx={{ fontSize: 18 }}>Resource Permissions:</ListSubheader>}
            >
              {Object.keys(rolePermission).map((resource, index, array) => (
                <ListItem
                  key={resource}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: index !== array.length - 1 ? '1px solid #e0e0e0' : 'none', // gray line except last
                    py: .3
                  }}
                >
                  <ListItemIcon>
                    <Adjust />
                  </ListItemIcon>

                  <ListItemText primary={resource} sx={{ minWidth: 120 }} />

                  {/* Option only for Node */}
                  {resource === 'Node' && (
                    <TextField
                      size="small"
                      placeholder="Option"
                      value={rolePermission[resource].option || ""}
                      onChange={(e) => handleOptionChange(resource, e.target.value)}
                      sx={{ mr: 2, width: 100 }}
                    />
                  )}

                  {/* Read Switch */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 1 }}>
                    <Switch
                      edge="end"
                      checked={rolePermission[resource].read}
                      onChange={() => handlePermissionToggle(resource, 'read')}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">Read</Typography>
                  </Box>

                  {/* Write Switch */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 1 }}>
                    <Switch
                      edge="end"
                      checked={rolePermission[resource].write}
                      onChange={() => handlePermissionToggle(resource, 'write')}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">Write</Typography>
                  </Box>
                </ListItem>
              ))}
            </List>

          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} variant="outlined">Cancel</Button>
          <Button onClick={updateRole} variant="contained" color="secondary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDetailsDialogOpen}
        onClose={closeDetailsDialog}
        closeAfterTransition
        disableRestoreFocus
        fullWidth
      >
        <IconButton
          aria-label="close"
          onClick={closeDetailsDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'GrayText',
          }}
        >
          <Close />
        </IconButton>
        <DialogTitle>Role Details</DialogTitle>

        <DialogContent>
          {/* Role Name */}
          <Paper
            sx={{
              p: 2,
              mb: 2,
              bgcolor: '#f5f5f5',
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Role:
            </Typography>
            <Typography variant="body1">{formData.roleName || '-'}</Typography>
          </Paper>

          {/* Role Description */}
          <Paper
            sx={{
              p: 2,
              mb: 2,
              bgcolor: '#f5f5f5',
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Description:
            </Typography>
            <Typography variant="body1">{formData.roleDescription || '-'}</Typography>
          </Paper>

          {/* Resource Permissions */}
          <List
            sx={{ width: '100%', bgcolor: 'background.paper' }}
            subheader={
              <ListSubheader sx={{ fontSize: 18 }}>Resource Permissions:</ListSubheader>
            }
          >
            {Object.keys(rolePermission).map((resource, index, array) => (
              <ListItem
                key={resource}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: index !== array.length - 1 ? '1px solid #e0e0e0' : 'none',
                  py: 0.3,
                }}
              >
                <ListItemIcon>
                  <Adjust />
                </ListItemIcon>

                <ListItemText primary={resource} sx={{ minWidth: 120 }} />

                {/* Option only for Node */}
                {resource === 'Node' && (
                  <Paper
                    sx={{ p: 0.5, mr: 2, bgcolor: '#e0e0e0', width: 100, textAlign: 'center' }}
                  >
                    <Typography variant="body2">
                      {rolePermission[resource].option || '-'}
                    </Typography>
                  </Paper>
                )}

                {/* Read */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 1 }}>
                  <Switch
                    edge="end"
                    checked={rolePermission[resource].read}
                    onChange={() => handlePermissionToggle(resource, 'read')}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Read
                  </Typography>
                </Box>

                {/* Write */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 1 }}>
                  <Switch
                    edge="end"
                    checked={rolePermission[resource].write}
                    onChange={() => handlePermissionToggle(resource, 'write')}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Write
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDetailsDialog}>Close</Button>
        </DialogActions>
      </Dialog>




      <Dialog
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        closeAfterTransition={true}
        disableRestoreFocus>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography> Are you sure you want to delete this role?</Typography>
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
    </Box>
  );
};

export default Role