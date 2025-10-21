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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Snackbar,
  Alert,
  Fade
} from '@mui/material';
import { Delete, Close, VisibilityOutlined, Edit, Router, CastConnected } from '@mui/icons-material';
import Ribbon from '../../common/Ribbon';
import CircularProgress from '@mui/material/CircularProgress';
import { useAxiosInstance } from '../Auth/AxiosProvider';
import CustomPagination from '../../components/CustomPagination'


const Company = () => {
  const { axiosInstance } = useAxiosInstance();
  const [rows, setRows] = useState([]);
  const [highlightedRowIds, setHighlightedRowIds] = useState([]); // State for tracking highlighted rows
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rowToDeleteId, setRowToDeleteId] = useState(null);
  const [isAddRackOpen, setIsAddRackOpen] = useState(false);

  /*###################################### Load All Data On Page Load #######################################*/
  const [dataLoading, setDataLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const [rowCount, setRowCount] = useState(0);

  const fetchData = useCallback(async ({ page, pageSize }) => {
    if (pageSize <= 0) return; // Ensure pageSize is always > 0
    setDataLoading(true);
    try {
      const response = await axiosInstance.get(`/companies/paging?pageIndex=${page}&pageSize=${pageSize}`);
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
      field: 'companyName',
      headerName: 'Firmenname',
      renderHeader: () => <strong>Firmenname</strong>,
      width: 300,
      cellClassName: (params) => (highlightedRowIds.includes(params.id) ? 'bold' : 'normal'),
    },
    {
      field: 'companyMail',
      headerName: 'E-Mail',
      renderHeader: () => <strong>E-Mail</strong>,
      width: 300,
      cellClassName: (params) => (highlightedRowIds.includes(params.id) ? 'bold' : 'normal'),
    },

        {
      field: 'companyPhone',
      headerName: 'Firma Phone',
      renderHeader: () => <strong>Firma Phone</strong>,
      width: 300,
      cellClassName: (params) => (highlightedRowIds.includes(params.id) ? 'bold' : 'normal'),
    },
            {
      field: 'companyState',
      headerName: 'Unternehmen Land',
      renderHeader: () => <strong>Firma Phone</strong>,
      width: 180,
       flex: 1,
      cellClassName: (params) => (highlightedRowIds.includes(params.id) ? 'bold' : 'normal'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
       renderHeader: () => <strong>Actions</strong>,
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" alignItems="right" spacing={3}>
          <IconButton onClick={() => openDetailsDialog(params.row)} size="medium" aria-label="link" color="primary"><VisibilityOutlined fontSize='inherit' /></IconButton>
          <IconButton onClick={() => openDialog(params.id)} size="medium" color="primary"><Edit fontSize='inherit' /></IconButton>
          <IconButton onClick={() => openDeleteDialog(params.id)} size="medium" color="primary"><Delete fontSize='inherit' /></IconButton>
        </Stack>
      ),
    },
  ];

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
    if (!formData.rackName) newErrors.rackName = 'Rack Name is required';
    return newErrors;
  };

  /*###################################### Add Rack #######################################*/
  const openAddDialog = () => {
    setIsAddRackOpen(true);
  };

  const closeAddDialog = () => {
    setIsAddRackOpen(false);;
  };

  const saveRack = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        await axiosInstance.post('/companies/', formData);
        fetchData(paginationModel);
        setOpen(true); // Show Success Message
        closeDialog();
        closeAddDialog();
      } catch (error) {
        console.log(error)
      }
    } else {
      setErrors(formErrors);
    }
  };

  /*###################################### Update Rack #######################################*/
  const updateRack = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const updatedRows = rows.map((row) =>
          row.id === selectedRow.id ? { ...row, ...formData } : row,
        );
        await axiosInstance.put(`/companies/${formData.id}`, formData);
        setRows(updatedRows);
        setHighlightedRowIds([selectedRow.id]); // Mark updated row
        setOpen(true); // Show Success Message
        closeDialog();
      } catch (error) {
        console.log(error);
      }
    } else {
      setErrors(formErrors);
    }
  };

  /***************Edit Rack*****************/

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


  /*###################################### Delete Rack #######################################*/
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const handleDeleteRow = async (id) => {
    try {
      const idToDelete = rowToDeleteId;
      if (idToDelete !== null) {
        const updatedRows = rows.filter((row) => row.id !== idToDelete);
        await axiosInstance.delete(`/companies/${idToDelete}`);
        setRows(updatedRows);
        closeDeleteDialog();
      }
    } catch (error) {
      console.error('Error deleting row:', error);
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

  /*###################################### Show Branch Details #######################################*/
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [rowDetails, setRowDetails] = useState({});

  const openDetailsDialog = (rowData) => {
    setSelectedRow(rowData || null);
    setRowDetails(rowData);
    setIsDetailsDialogOpen(true);
  };

  const closeDetailsDialog = () => {
    setHighlightedRowIds([]);
    setSelectedRow(null);
    setRowDetails({});
    setIsDetailsDialogOpen(false);
  };

  /*###################################### Reset Branch #######################################*/
  const resetRack = () => {
    setFormData({
      rackName: '',
      rackDetails: '',
      rackArea: ''
    });
    setErrors({});
  };


  /*###################################### Alert On Rack Save #######################################*/
  const [open, setOpen] = useState(false);
  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  /*###################################### Map coloum name is details dialog #######################################*/
  const keyNameMapping = {
    rackName: 'Rack Name',
    rackDetails: 'Rack Details',
    rackArea: 'Rack Area',
    epaperCount: 'ePapers',
    stationCount: 'Stations',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
  };
  /* ######################################### Grid Selected Item ###################################### */
  // const [selectedRows, setSelectedRows] = useState([]);
  // const handleSelectionChange = (newSelectionModel) => {
  //   setSelectedRows(newSelectionModel);
  // };
  // const selectedElement = () => {
  //   return selectedRows.length;
  // };

  return (
    <Box>
      <Ribbon
        addElement={(openAddDialog)}
        handleExport={""}
        refreshElement={() => fetchData(paginationModel)}
        route={"firma"} />

      <Dialog
        open={isAddRackOpen}
        onClose={closeAddDialog}
        closeAfterTransition={true}
        disableRestoreFocus
        fullWidth>
        <DialogTitle>Add Rack</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={closeAddDialog}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: "GrayText"
          })}
        >
          <Close />
        </IconButton>

        <DialogContent>
          <Box>
            <TextField
              name="rackName"
              value={formData.rackName || ''}
              onChange={handleChange}
              required
              fullWidth
              id="rackName"
              label="Rack Name"
              error={!!errors.rackName}
              helperText={errors.rackName}

              autoFocus
            />

            <TextField
              fullWidth
              name="rackDetails"
              label="Rack Details"
              value={formData.rackDetails || ''}
              onChange={handleChange}
              autoComplete="rack-details"
              margin="normal"
            />

            <TextField
              fullWidth
              name="rackArea"
              value={formData.rackArea || ''}
              id="rackArea"
              label="Rack Area"
              onChange={handleChange}
              autoComplete="rack-area"
              margin="dense"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ pb: 1 }}>
          <Button onClick={resetRack} variant="outlined" color="secondary">Reset</Button>
          <Button onClick={saveRack} variant="contained" color="secondary" sx={{ mr: 2 }}>Add Rack</Button>
        </DialogActions>
      </Dialog>

      {/* Server side paging */}
     <Paper sx={{ transition: 'height 0.3s ease', overflowX: 'hidden', minWidth: '100%' }}>
        <Fade in={!dataLoading} timeout={300}>
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

              // onRowSelectionModelChange={handleSelectionChange}
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


      <Snackbar
        open={open}
        autoHideDuration={1000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={closeSnackbar}
      >
        <Alert
          onClose={closeSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}>
          Rack Save Successfully
        </Alert></Snackbar>

      <Dialog open={isDialogOpen}
        onClose={closeDialog}
        closeAfterTransition={true}
        disableRestoreFocus
      >
        <DialogTitle>Edit Rack</DialogTitle>
        <DialogContent>
          <TextField
            name="rackName"
            label="Rack Name"
            value={formData.rackName || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="rackDetails"
            label="Rack Details"
            value={formData.rackDetails || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="rackArea"
            label="Rack Area"
            value={formData.rackArea || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary">Cancel</Button>
          <Button onClick={updateRack} sx={{ mr: 2 }} variant="contained" color="primary">
            UPDATE
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDetailsDialogOpen}
        onClose={closeDialog}
        closeAfterTransition={true}
        disableRestoreFocus
        fullWidth>
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
        <DialogTitle>Rack Details</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <TableContainer>
            <Table size="small" aria-label="a dense table" sx={{ borderCollapse: 'collapse' }}>
              <TableBody>
                {Object.entries(rowDetails)
                  .filter(([key]) => !['id', 'rackImage', 'storeId'].includes(key)) // Filter out unwanted keys
                  .map(([key, value]) => {
                    const displayKey = keyNameMapping[key] || key;

                    return (
                      <TableRow key={key} sx={{ borderBottom: 'none' }}>
                        <TableCell align='left' width="100" component="th" sx={{ borderBottom: 'none', padding: '8px 16px' }}>
                          <strong>{displayKey}:</strong>
                        </TableCell>
                        <TableCell align='left' sx={{ borderBottom: 'none' }}>
                          {value}
                        </TableCell>
                      </TableRow>
                    ); // Ensure no empty lines here
                  })}
              </TableBody>
            </Table>
          </TableContainer>

        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetailsDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        closeAfterTransition={true}
        disableRestoreFocus
      >
        <IconButton
          aria-label="close"
          onClick={closeDeleteDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: "GrayText"
          }}>
          <Close />
        </IconButton>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography> Are you sure you want to delete this rack ?</Typography>
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

export default Company