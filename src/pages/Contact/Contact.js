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
  Grid,
  CircularProgress
} from '@mui/material';
import { Delete, Close, VisibilityOutlined, Edit, PictureAsPdf } from '@mui/icons-material';
import Ribbon from '../../common/Ribbon';
import { useAxiosInstance } from '../Auth/AxiosProvider';
import CustomPagination from '../../components/CustomPagination'


const Contact = () => {
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
      const response = await axiosInstance.get(`/contacts/paging?pageIndex=${page}&pageSize=${pageSize}`);
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
      field: 'firstName',
      headerName: 'Vorname',
      renderHeader: () => <strong>Vorname</strong>,
      width: 200,

      cellClassName: (params) => (highlightedRowIds.includes(params.id) ? 'bold' : 'normal'),
    },
    {
      field: 'name',
      headerName: 'Nachname',
      renderHeader: () => <strong>Nachname</strong>,
      width: 200,
      cellClassName: (params) => (highlightedRowIds.includes(params.id) ? 'bold' : 'normal'),
    },
    {
      field: 'phoneCompany',
      headerName: 'Durchwahl',
      renderHeader: () => <strong>Durchwahl</strong>,
      width: 150,
      flex: 1,
      cellClassName: (params) => (highlightedRowIds.includes(params.id) ? 'bold' : 'normal'),
    },
    {
      field: 'profession',
      headerName: 'Position in der Firma',
      renderHeader: () => <strong>Position in der Firma</strong>,
      width: 190,
      flex: 1,
      cellClassName: (params) => (highlightedRowIds.includes(params.id) ? 'bold' : 'normal'),
    },
    {
      field: 'email1',
      headerName: 'Email-1',
      renderHeader: () => <strong>Email-1</strong>,
      width: 190,
      flex: 1,
      cellClassName: (params) => (highlightedRowIds.includes(params.id) ? 'bold' : 'normal'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderHeader: () => <strong>Actions</strong>,
      width: 280,
      renderCell: (params) => (
        <Stack direction="row" alignItems="right" spacing={3}>
          <IconButton onClick={() => openDetailsDialog(params.row)} size="medium" aria-label="link" color="primary"><VisibilityOutlined fontSize='inherit' /></IconButton>
          <IconButton onClick={() => openPdfDialog(params.row)} size="medium" aria-label="link" color="primary"><PictureAsPdf fontSize='inherit' /></IconButton>
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

  /*###################################### Add Contact #######################################*/
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
        await axiosInstance.post('/contacts/', formData);
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

  /*###################################### Update Contact #######################################*/
  const updateRack = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const updatedRows = rows.map((row) =>
          row.id === selectedRow.id ? { ...row, ...formData } : row,
        );
        await axiosInstance.put(`/contacts/${formData.id}`, formData);
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

  /***************Edit Kontakt*****************/

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


  /*###################################### Delete Contact #######################################*/
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const handleDeleteRow = async (id) => {
    try {
      const idToDelete = rowToDeleteId;
      if (idToDelete !== null) {
        const updatedRows = rows.filter((row) => row.id !== idToDelete);
        await axiosInstance.delete(`/contacts/${idToDelete}`);
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

  /*###################################### Show Contact Details #######################################*/
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


  /*###################################### Generate Pdf #######################################*/

  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [prices, setPrices] = useState(['']); // Start with one price field
  const [invoiceNumber, setInvoiceNumber] = useState('');


  const addPriceField = () => {
    setPrices([...prices, '']);
  };

  const updatePrice = (index, value) => {
    const updated = [...prices];
    updated[index] = value;
    setPrices(updated);
  };

  const resetPriceFields = () => {
    setPrices(['']); // Resets to a single empty field
  };


  const buildPdf = async (rowData) => {
    // Prepare PDF data object
    const pdfData = {
      pdfCreator: "Adminstraor" || "",
      clientNamePrefix: rowData.prefix || "",
      clientFirstname: rowData.firstName || "",
      clientLastname: rowData.name || "",
      clientAddress: rowData.privateAddressStreet || "",
      clientPostCode: rowData.privateAddressPostcode || "",
      clientCity: rowData.privateAddressCity || "",
      clientCountry: rowData.privateAddressCountry || "",
      vatNumber: rowData.vatNumber || "",
      city: rowData.city || "",
      date: rowData.formattedDate || "", // make sure formattedDate is part of rowData
      invoiceNumber: invoiceNumber.trim() || "",
      invoiceTitle: rowData.invoiceTitle || "",
      bankName: rowData.bankName || "",
      iban: rowData.iban || "",
      swift: rowData.swift || "",
      exchangeRate: rowData.exchangeRate || 1, // default value if missing
      priceList: rowData.prices || [],
      comment: comment.trim() || "",
    };

    try {
      const response = await axiosInstance.post('/pdf/pdf-view', pdfData)

      const base64Image = response.data;
      setImageSrc(`data:image/png;base64,${base64Image}`);
      setIsPdfDialogOpen(true);

    } catch (error) {
      console.error("Error generating PDF:", error);
    }

  };

  const openPdfDialog = async (rowData) => {
    setSelectedRow(rowData || null);
    setRowDetails(rowData);
    buildPdf(rowData);
  };


  const closePdfDialog = () => {
    setHighlightedRowIds([]);
    setSelectedRow(null);
    setRowDetails({});
    setIsPdfDialogOpen(false);
  };


  /*###################################### Reset Kontakt #######################################*/
  const resetRack = () => {
    setFormData({
      rackName: '',
      rackDetails: '',
      rackArea: ''
    });
    setErrors({});
  };


  /*###################################### Alert On Contact Save #######################################*/
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
        route={"kontakt"} />

      <Dialog
        open={isAddRackOpen}
        onClose={closeAddDialog}
        closeAfterTransition={true}
        disableRestoreFocus
        fullWidth>
        <DialogTitle>Kontakt hinzufügen</DialogTitle>
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
      <Paper>
        <DataGrid
          rows={rows}
          columns={columns}
          rowCount={rowCount}                // total rows from backend
          paginationMode="server"            // enable server-side pagination
          paginationModel={paginationModel}  // controlled pagination state
          onPaginationModelChange={handlePaginationModelChange}
          columnHeaderHeight={56}
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
      </Paper>


      <Snackbar
        open={open}
        autoHideDuration={3000}
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
        <DialogTitle>Kontakt hinzufügen</DialogTitle>
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
        <DialogTitle>Kontaktdetails</DialogTitle>
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



      {/*  Generate Pdf   */}
      <Dialog
        open={isPdfDialogOpen}
        onClose={closePdfDialog}
        closeAfterTransition
        disableRestoreFocus
        fullWidth
        maxWidth="xl"
      >
        <IconButton
          aria-label="close"
          onClick={closePdfDialog}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'GrayText' }}>
          <Close />
        </IconButton>

        <DialogTitle>PDF</DialogTitle>

        <DialogContent>
          <Button variant="outlined" onClick={addPriceField} sx={{ mt: 1, mr: 1 }}>
            + Felder hinzufügen
          </Button>
          <Button variant="outlined" onClick={resetPriceFields} sx={{ mt: 1, mr: 1 }}>
            Zurücksetzen
          </Button>
          <Button variant="contained" color='primary' onClick={buildPdf} sx={{ mt: 1 }}>
            Update PDF
          </Button>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="Rechnungsnummer"
                fullWidth
                margin="normal"
                multiline
                // You can adjust this number as needed
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)} />


              <TextField
                label="Kommentare hinzufügen"
                fullWidth
                margin="normal"
                multiline
                rows={3} // You can adjust this number as needed
                value={comment}
                onChange={(e) => setComment(e.target.value)} />


              {prices.map((price, index) => (
                <TextField
                  key={index}
                  label={`Price ${index + 1}`}
                  fullWidth
                  margin="normal"
                  value={price}
                  onChange={(e) => updatePrice(index, e.target.value)}
                />
              ))}


            </Grid>

            <Grid item xs={8}>
              <Paper sx={{ mt: 2, width: 'fit-content' }} elevation={3}>
                {loading && <CircularProgress />}
                <img
                  src={imageSrc}
                  alt="template"
                  onLoad={() => setLoading(false)}
                  style={{ display: loading ? 'none' : 'inline' }}
                />
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
            <Button variant="contained" color='primary' onClick={buildPdf} sx={{ mt: 1 }}>
            Generate PDF
          </Button>
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
        <DialogTitle>Löschen bestätigen</DialogTitle>
        <DialogContent>
          <Typography> Möchten Sie diesen Kontakt wirklich löschen?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Stornieren
          </Button>
          <Button onClick={handleDeleteRow} variant="contained" color="error">
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Contact