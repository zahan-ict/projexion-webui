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
  Grid
} from '@mui/material';
import { Delete, Close, VisibilityOutlined, Edit } from '@mui/icons-material';
import Ribbon from '../../common/Ribbon';
import CircularProgress from '@mui/material/CircularProgress';
import { useAxiosInstance } from '../Auth/AxiosProvider';
import CustomPagination from '../../components/CustomPagination';
import { useSearch } from '../../common/SearchContext';

const Company = () => {
  const { axiosInstance } = useAxiosInstance();

  /* ---------------- STATE ---------------- */
  const [rows, setRows] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const [rowCount, setRowCount] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const { searchTerm, searchTrigger } = useSearch();


  /* Dialogs */
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDeleteId, setRowToDeleteId] = useState(null);
  const [rowDetails, setRowDetails] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);

  /* ################################### Load data on page load  #####################################*/
  const fetchData = useCallback(async ({ page, pageSize }) => {
    if (pageSize <= 0) return;
    setDataLoading(true);
    try {
      const response = await axiosInstance.get(`/companies/paging?pageIndex=${page}&pageSize=${pageSize}`);
      const { data, totalCount } = response.data;
      setRows(data || []);
      setRowCount(totalCount || 0);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setDataLoading(false);
    }
  }, [axiosInstance]);

  useEffect(() => {
    fetchData(paginationModel);
  }, [fetchData, paginationModel]);

  const handlePaginationModelChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };

  /*###################################### Search Company #######################################*/
  const searchCompanies = useCallback(async () => {
    if (!searchTerm) return fetchData({ page: 0, pageSize: 20 });
    setDataLoading(true);
    try {
      const response = await axiosInstance.get(`/companies/search?q=${encodeURIComponent(searchTerm)}`);
      setRows(response.data || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setDataLoading(false);
    }
  }, [axiosInstance, searchTerm, fetchData]);

  // Only triggered manually
  useEffect(() => {
    if (searchTrigger > 0) searchCompanies();
  }, [searchTrigger, searchCompanies])


  /* ---------------- TABLE COLUMNS ---------------- */
  const columns = [
    {
      field: 'companyName',
      headerName: 'Firmenname',
      renderHeader: () => <strong>Firmenname</strong>,
      flex: 1
    },
    {
      field: 'companyMail',
      headerName: 'E-Mail',
      renderHeader: () => <strong>E-Mail</strong>,
      flex: 1
    },
    {
      field: 'companyPhone',
      headerName: 'Telefon',
      renderHeader: () => <strong>Telefon</strong>,
      flex: 1
    },
    {
      field: 'companyState',
      headerName: 'Land',
      renderHeader: () => <strong>Land</strong>,
      flex: 1
    },

    {
      field: 'companyCity',
      headerName: 'Stadt',
      renderHeader: () => <strong>Stadt</strong>,
      flex: 1
    },
    {
      field: 'actions',
      headerName: 'Aktionen',
      renderHeader: () => <strong>Actions</strong>,
      width: 190,
      renderCell: (params) => (
        <Stack direction="row" spacing={2}>
          <IconButton onClick={() => openDetailsDialog(params.row)} color="primary">
            <VisibilityOutlined />
          </IconButton>
          <IconButton onClick={() => openEditDialog(params.row)} color="primary">
            <Edit />
          </IconButton>
          <IconButton onClick={() => openDeleteDialog(params.row.id)} color="primary">
            <Delete />
          </IconButton>
        </Stack>
      ),
    },
  ];

  /* ################################### Handle Error  #####################################*/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName) newErrors.companyName = 'Firmenname ist erforderlich';
    // if (!formData.companyMail) newErrors.companyMail = 'E-Mail ist erforderlich';
    return newErrors;
  };

  /*################################### Add Company  #####################################*/
  const handleAddCompany = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) return setErrors(formErrors);
    try {
      await axiosInstance.post('/companies', formData);
      fetchData(paginationModel);
      setOpenSnackbar(true);
      closeCompanyDialog();
    } catch (error) {
      console.error('Error adding company:', error);
    }
  };
  /* ################################### Uodate Companz  #####################################*/
  const handleUpdateCompany = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) return setErrors(formErrors);

    try {
      await axiosInstance.put(`/companies/${formData.id}`, formData);
      fetchData(paginationModel);
      setOpenSnackbar(true);
      closeCompanyDialog();
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  /* ################################### Handle Delete  #####################################*/
  const handleDeleteCompany = async () => {
    try {
      await axiosInstance.delete(`/companies/${rowToDeleteId}`);
      fetchData(paginationModel);
      closeDeleteDialog();
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  /* ---------------- DIALOG OPEN/CLOSE ---------------- */
  const openAddDialog = () => {
    setDialogMode("add");
    setFormData({});
    setErrors({});
    setIsCompanyDialogOpen(true);
  };

  const openEditDialog = (rowData) => {
    setDialogMode("edit");
    setFormData(rowData);
    setErrors({});
    setIsCompanyDialogOpen(true);
  };

  const closeCompanyDialog = () => {
    setFormData({});
    setErrors({});
    setIsCompanyDialogOpen(false);
  };

  const openDeleteDialog = (id) => {
    setRowToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setRowToDeleteId(null);
    setIsDeleteDialogOpen(false);
  };

  const openDetailsDialog = (rowData) => {
    setRowDetails(rowData);
    setIsDetailsDialogOpen(true);
  };

  const closeDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
  };

  /* ---------------- KEY MAPPING ---------------- */
  const keyNameMapping = {
    companyName: 'Firmenname',
    companyMail: 'E-Mail',
    companyPhone: 'Telefon',
    companyAddress: 'Adresse',
    companyCity: 'Stadt',
    companyState: 'Land',
    companyZip: 'PLZ',
    createdAt: 'Erstellt am',
    updatedAt: 'Aktualisiert am',
  };

  const formatValue = (key, value) => {
    if (!value) return "-";
    if (["createdAt", "updatedAt"].includes(key)) {
      const date = new Date(value);
      return isNaN(date)
        ? value
        : date.toLocaleString("de-DE", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
    }
    return value;
  };

  /* ---------------- RENDER ---------------- */
  return (
    <Box>
      <Ribbon
        addElement={openAddDialog}
        handleExport={""}
        refreshElement={() => fetchData(paginationModel)}
        route={"firma"}
      />

      {/*.............................Add/Edit Company.................... */}
      <Dialog open={isCompanyDialogOpen}
        onClose={closeCompanyDialog}
        fullWidth maxWidth="xl"
        closeAfterTransition
        disableRestoreFocus>
        <IconButton
          aria-label="close"
          onClick={closeCompanyDialog}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'GrayText' }}>
          <Close />
        </IconButton>
        <DialogTitle>
          {dialogMode === "add" ? "Firma hinzufügen" : "Firma bearbeiten"}
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <Paper sx={{ mt: 1, p: 2 }} elevation={3}>
                <Grid container spacing={3}>
                  {/* === Firmeninformationen === */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Firmeninformationen
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Firmenname"
                      name="companyName"
                      value={formData.companyName ?? ""}
                      onChange={handleChange}
                      error={!!errors.companyName}
                      helperText={errors.companyName}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="E-Mail"
                      name="companyMail"
                      value={formData.companyMail ?? ""}
                      onChange={handleChange}
                    // error={!!errors.companyMail}
                    // helperText={errors.companyMail}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefon 1"
                      name="companyPhone"
                      value={formData.companyPhone ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefon 2"
                      name="companyPhone2"
                      value={formData.companyPhone2 ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefon 3"
                      name="companyPhone3"
                      value={formData.companyPhone3 ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefon 4"
                      name="companyPhone4"
                      value={formData.companyPhone4 ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefon 5"
                      name="companyPhone5"
                      value={formData.companyPhone5 ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Fax"
                      name="companyFax"
                      value={formData.companyFax ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Durchwahl"
                      name="companyDurchwahl"
                      value={formData.companyDurchwahl ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* === Adresse === */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
                      Adresse
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Straße"
                      name="companyStreet"
                      value={formData.companyStreet ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Postfach"
                      name="companyPostbox"
                      value={formData.companyPostbox ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Stadt"
                      name="companyCity"
                      value={formData.companyCity ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Postleitzahl (PLZ)"
                      name="companyPostcode"
                      value={formData.companyPostcode ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bundesland / Kanton"
                      name="companyState"
                      value={formData.companyState ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Land"
                      name="companyCountry"
                      value={formData.companyCountry ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* === Interne Informationen === */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
                      Interne Informationen
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Adresskategorie (Firmenadresscat)"
                      name="firmenadresscat"
                      value={formData.firmenadresscat ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Notizen"
                      name="companyNotes"
                      value={formData.companyNotes ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper sx={{ mt: 1, p: 2 }} elevation={3}>
                {/* === Online-Präsenz === */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Online-Präsenz
                  </Typography>
                </Grid>
                <Grid container spacing={3}>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      label="Website"
                      name="companyWebsite"
                      value={formData.companyWebsite ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      label="Facebook"
                      name="companyFacebook"
                      value={formData.companyFacebook ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      label="Instagram"
                      name="companyInstagram"
                      value={formData.companyInstagram ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      label="Twitter / X"
                      name="companyTwitter"
                      value={formData.companyTwitter ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </Paper>

            </Grid>
          </Grid>
        </DialogContent>


        <DialogActions>
          <Button onClick={closeCompanyDialog} color="secondary">
            Abbrechen
          </Button>
          {dialogMode === "add" ? (
            <Button onClick={handleAddCompany} variant="contained" color="primary">
              Hinzufügen
            </Button>
          ) : (
            <Button onClick={handleUpdateCompany} variant="contained" color="primary">
              Aktualisieren
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/*.....................Company Details................ */}
      <Dialog open={isDetailsDialogOpen}
        onClose={closeDetailsDialog}
        fullWidth maxWidth="sm"
        closeAfterTransition
        disableRestoreFocus
      >
        <IconButton
          aria-label="close"
          onClick={closeDetailsDialog}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'GrayText' }}
        >
          <Close />
        </IconButton>
        <DialogTitle>Firmendetails</DialogTitle>
        <DialogContent dividers>
          <TableContainer>
            <Table size="small">
              <TableBody>
                {Object.entries(rowDetails)
                  .filter(([key]) => key !== "deletedAt")
                  .map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell sx={{ borderBottom: 'none' }}>
                        <strong>{keyNameMapping[key] || key}:</strong>
                      </TableCell>
                      <TableCell sx={{ borderBottom: 'none' }}>
                        {formatValue(key, value)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetailsDialog}>Schließen</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        closeAfterTransition
        disableRestoreFocus
      >
        <DialogTitle>Löschen bestätigen</DialogTitle>
        <DialogContent>
          <Typography> Möchten Sie diesen Firma wirklich löschen?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Abbrechen</Button>
          <Button onClick={handleDeleteCompany} color="error" variant="contained">
            Löschen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" variant="filled">
          Firma erfolgreich gespeichert!
        </Alert>
      </Snackbar>

      {/* Table */}
      <Paper sx={{ mt: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowCount={rowCount}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          columnHeaderHeight={56}
          disableSelectionOnClick
          hideFooterSelectedRowCount
          getRowHeight={() => 65}
          pageSizeOptions={[10, 20, 50]}
          autoHeight
          loadingOverlay={<div className="Data-Loader"><CircularProgress /></div>}
          loading={dataLoading}
          onCellClick={(params, event) => {
            if (params.field !== '__check__') {
              event.stopPropagation();
            }
          }}
          slots={{ pagination: CustomPagination }}

        />
      </Paper>
    </Box>
  );
};

export default Company;
