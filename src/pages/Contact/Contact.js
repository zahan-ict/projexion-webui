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
  CircularProgress,
  ButtonGroup,
  Autocomplete,
  Checkbox,
  Chip
} from '@mui/material';
import { Delete, Close, VisibilityOutlined, Edit, PictureAsPdf, AddCircle, RemoveCircle } from '@mui/icons-material';
import Ribbon from '../../common/Ribbon';
import { useAxiosInstance } from '../Auth/AxiosProvider';
import CustomPagination from '../../components/CustomPagination'



const Contact = () => {
  const { axiosInstance } = useAxiosInstance();
  const [rows, setRows] = useState([]);
  const [highlightedRowIds, setHighlightedRowIds] = useState([]); // State for tracking highlighted rows
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowToDeleteId, setRowToDeleteId] = useState(null);


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
      headerName: 'Phone',
      renderHeader: () => <strong>Phone</strong>,
      width: 150,
      flex: 1,
      cellClassName: (params) => (highlightedRowIds.includes(params.id) ? 'bold' : 'normal'),
    },
    {
      field: 'companyPosition',
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
      width: 240,
      renderCell: (params) => (
        <Stack direction="row" alignItems="right" spacing={2}>
          <IconButton onClick={() => openDetailsDialog(params.row)} size="medium" aria-label="link" color="primary"><VisibilityOutlined fontSize='inherit' /></IconButton>
          <IconButton onClick={() => openPdfDialog(params.row)} size="medium" aria-label="link" color="primary"><PictureAsPdf fontSize='inherit' /></IconButton>
          <IconButton onClick={() => openEditDialog(params.row)} size="medium" color="primary"><Edit fontSize='inherit' /></IconButton>
          <IconButton onClick={() => openDeleteDialog(params.id)} size="medium" color="primary"><Delete fontSize='inherit' /></IconButton>
        </Stack>
      ),
    },
  ];

  /*###################################### Add Contact #######################################*/
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [formData, setFormData] = useState({
    prefix: '',
    name: '',
    firstName: '',
    privateAddressStreet: '',
    privateAddressPostcode: '',
    privateAddressCity: '',
    privateAddressCountry: '',
    companyPosition: '',
    contactNotes: '',
    phone: '',
    phoneCompany: '',
    phoneCentral: '',
    fax: '',
    email1: '',
    email2: '',
    companyIs: '',
    profession: '',
    birthDate: '',
    ahvNumber: '',
    nationality: '',
    bank: '',
    bankAccount: '',
    postcheckAccount: '',
    projects: [],
    companies: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    // Simple validation example
    if (!formData.name || !formData.firstName) {
      alert('Vorname und Nachname sind erforderlich');
      return;
    }
    //  const formErrors = validateForm();
    const payload = {
      ...formData,
      projects: formData.projects?.map((p) => ({
        id: p.id,
        projectName: p.projectName
      })) || [],
      companies: formData.companies?.map((c) => ({
        id: c.id,
        companyName: c.companyName, // or whatever fields you have
      })) || [],
    };

    try {
      await axiosInstance.post('/contacts/', payload);
      fetchData(paginationModel);
      setOpen(true); // Show Success Message
      closeAddDialog();
    } catch (error) {
      console.log(error)
    }
  };

  const openAddDialog = () => {
    setDialogMode("add");
    setFormData({}); // clear form
    setIsAddContactOpen(true);
  };

  const closeAddDialog = () => {
    setIsAddContactOpen(false);;
  };

  // === Right Side: Project (autocomplete) ===
  const [projects, setProjects] = useState([]);  // Available projects
  const handleProject = async () => {
    try {
      const res = await axiosInstance.get("/projects/project-name");
      const transformed = Object.entries(res.data).map(([name, id]) => ({
        projectName: name,
        id: id,
      }));
      setProjects(transformed);

    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  // === Right Side: Company (autocomplete) ===
  const [companies, setCompanies] = useState([]);  // Available projects
  const handleCompany = async () => {
    try {
      const res = await axiosInstance.get("/companies/company-name");
      const transformed = Object.entries(res.data).map(([name, id]) => ({
        companyName: name,
        id: id,
      }));
      setCompanies(transformed);

    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  /*###################################### Update Contact #######################################*/

  const updateContact = async () => {
    try {
      // Build payload in correct format
      const payload = {
        ...formData,
        // Map companies and projects to expected structure
        companies: formData.companies?.map(c => ({
          id: c.id,
          companyName: c.companyName
        })) || [],
        projects: formData.projects?.map(p => ({
          id: p.id,
          projectName: p.projectName
        })) || [],

        // Optional: remove these if backend doesn't need them
        companyIs: undefined,
        projectIs: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };
      await axiosInstance.put(`/contacts/${formData.id}`, payload);
      fetchData(paginationModel); // refresh table
      setOpen(true);
      closeAddDialog();
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };


  const openEditDialog = (rowData) => {
    // Safely parse companyIs and projectIs if they exist
    const parsedCompanies =
      typeof rowData.companyIs === "string" && rowData.companyIs.trim() !== ""
        ? JSON.parse(rowData.companyIs)
        : rowData.companies || [];

    const parsedProjects =
      typeof rowData.projectIs === "string" && rowData.projectIs.trim() !== ""
        ? JSON.parse(rowData.projectIs)
        : rowData.projects || [];

    // Merge parsed data into formData
    setDialogMode("edit");
    setFormData({
      ...rowData,
      companies: parsedCompanies,
      projects: parsedProjects,
    });
    setIsAddContactOpen(true); // Reuse the same Add form for editing
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
  const [priceNote, setPriceNote] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');

  const [prices, setPrices] = useState([{ description: '', amount: '' }]); // Start with one price field
  const addPriceField = () => {
    setPrices([...prices, { description: "", amount: "" }]);
  };

  const resetPriceFields = () => {
    setPrices([{ description: "", amount: "" }]);
  };

  const updatePrice = (index, field, value) => {
    const updated = [...prices];
    updated[index] = { ...updated[index], [field]: value };
    setPrices(updated);
  };

  const buildPdf = async (mode, rowData) => {
    const pdfData = {
      pdfCreator: "Administrator", // fixed typo
      clientNamePrefix: rowData.prefix || "",
      clientFirstname: rowData.firstName || "",
      clientLastname: rowData.name || "",
      clientAddress: rowData.privateAddressStreet || "",
      clientPostCode: rowData.privateAddressPostcode || "",
      clientCity: rowData.privateAddressCity || "",
      clientCountry: rowData.privateAddressCountry || "",
      vatNumber: rowData.vatNumber || "",
      city: rowData.city || "",
      date: rowData.formattedDate || "",
      invoiceNumber: invoiceNumber?.trim() || "", // ensure invoiceNumber is in scope
      invoiceTitle: rowData.invoiceTitle || "",
      bankName: rowData.bankName || "",
      iban: rowData.iban || "",
      swift: rowData.swift || "",
      exchangeRate: rowData.exchangeRate || 1,

      priceList: prices.map(p => ({
        description: p.description.trim(),
        amount: Number(p.amount) || 0
      })),

      comment: comment?.trim() ? comment.trim() : "Kommentare hinzufügen .....", // ensure comment is in scope
      priceNote: priceNote?.trim() ? priceNote.trim() : "Pris Notiz .....", // ensure comment is in scope
    };

    try {
      if (mode === "pdf") {
        const response = await axiosInstance.post('/pdf/pdf-generate', pdfData, {
          responseType: 'arraybuffer',
        });
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl);
        setIsPdfDialogOpen(true);
      } else {
        const response = await axiosInstance.post('/pdf/pdf-view', pdfData, {
          responseType: 'arraybuffer', // 👈 important!
        });

        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setImageSrc(pdfUrl);
        setIsPdfDialogOpen(true);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };


  const openPdfDialog = async (rowData) => {
    setSelectedRow(rowData || null);
    setRowDetails(rowData);
    buildPdf("png", rowData);
  };


  const closePdfDialog = () => {
    setHighlightedRowIds([]);
    setSelectedRow(null);
    setRowDetails({});
    setIsPdfDialogOpen(false);
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
    prefix: "Anrede",
    name: "Nachname",
    firstName: "Vorname",
    privateAddressStreet: "Strasse",
    privateAddressPostcode: "PLZ",
    privateAddressCity: "Ort",
    privateAddressCountry: "Land",
    companyPosition: "Position",
    contactNotes: "Kontakt Notiz",
    phone: "Telefon (Privat)",
    phoneCompany: "Telefon (Geschäftlich)",
    phoneCentral: "Zentrale Telefonnummer",
    fax: "Fax / E-Mail",
    email1: "E-Mail 1",
    email2: "E-Mail 2",
    companyIs: "Firma",
    projectIs: "projects",
    profession: "Beruf",
    bank: "Bank",
    bankAccount: "Bank Konto",
    postcheckAccount: "Post Check Konto",
    birthDate: "Geburtsdatum",
    ahvNumber: "AHV Nummer",
    nationality: "Nationalität",
    createdAt: "Erstellt am",
    updatedAt: "Aktualisiert am"
  };


  return (
    <Box>
      <Ribbon
        addElement={(openAddDialog)}
        handleExport={""}
        refreshElement={() => fetchData(paginationModel)}
        route={"kontakt"} />

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
          // checkboxSelection
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
          Kontakt Erfolgreich speichern
        </Alert></Snackbar>

      {/*....................Add and Update Contact................ */}
      <Dialog
        open={isAddContactOpen}
        onClose={closeAddDialog}
        closeAfterTransition
        disableRestoreFocus
        fullWidth
        maxWidth="xl"
      >
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
        <DialogTitle> {dialogMode === "add" ? "Kontakt hinzufügen" : "Kontakt bearbeiten"}</DialogTitle>
        <DialogContent dividers>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>

              <Paper sx={{ mt: 1, p: 2 }} elevation={3}>
                <Grid container spacing={3}>
                  {/* === Personal Information === */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Persönliche Angaben
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Anrede"
                      name="prefix"
                      value={formData.prefix ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Vorname"
                      name="firstName"
                      value={formData.firstName ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Nachname"
                      name="name"
                      value={formData.name ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Strasse"
                      name="privateAddressStreet"
                      value={formData.privateAddressStreet ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="PLZ"
                      name="privateAddressPostcode"
                      value={formData.privateAddressPostcode ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Ort"
                      name="privateAddressCity"
                      value={formData.privateAddressCity ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* === Company Information === */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Firmeninformationen
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>

                    <Autocomplete
                      multiple
                      id="company-autocomplete"
                      options={Array.isArray(companies) ? companies : []} // remove warning: Empty string passed to getElementById()
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.companyName}
                      onOpen={handleCompany} //  fetch when opened
                      value={formData.companies || []}
                      //handle selection
                      onChange={(event, value) =>
                        setFormData((prev) => ({
                          ...prev,
                          companies: value, // store full selected objects
                        }))
                      }
                      renderOption={(props, option, { selected }) => {
                        const { key, ...optionProps } = props;
                        return (
                          <li key={key} {...optionProps}>
                            <Checkbox
                              checked={selected}
                            />
                            {option.companyName}
                          </li>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Firma auswählen" placeholder="Firma auswählen" />
                      )}
                    />
                  </Grid>


                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Position"
                      name="companyPosition"
                      value={formData.companyPosition ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* === Contact Information === */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Kontaktinformationen
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Telefon (Privat)"
                      name="phone"
                      value={formData.phone ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Telefon (Geschäftlich)"
                      name="phoneCompany"
                      value={formData.phoneCompany ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Zentrale Telefonnummer"
                      name="phoneCentral"
                      value={formData.phoneCentral ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="E-Mail 1"
                      name="email1"
                      value={formData.email1 ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="E-Mail 2"
                      name="email2"
                      value={formData.email2 ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* === Notes === */}
                  <Grid item xs={12}>
                    <TextField
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      label="Kontakt Notiz"
                      name="contactNotes"
                      value={formData.contactNotes ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>
                  {/* === Bank Info === */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Bank Informationen
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Bank"
                      name="bank"
                      value={formData.bank ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Bank Konto"
                      name="bankAccount"
                      value={formData.bankAccount ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="PostCheck Konto"
                      name="postcheckAccount"
                      value={formData.postcheckAccount ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* === Additional Info === */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Weitere Informationen
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Geburtsdatum"
                      name="birthDate"
                      InputLabelProps={{ shrink: true }}
                      value={formData.birthDate ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Nationalität"
                      name="nationality"
                      value={formData.nationality ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="AHV Nummer"
                      name="ahvNumber"
                      value={formData.ahvNumber ?? ""}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>

              {/* PROJECT AUTOCOMPLETE */}
              <Paper sx={{ mt: 2, p: 2 }} elevation={3}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Projekt zuordnen
                </Typography>

                <Autocomplete
                  multiple
                  id="project-autocomplete"
                  options={Array.isArray(projects) ? projects : []} // remove warning: Empty string passed to getElementById()
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.projectName}
                  onOpen={handleProject} //  fetch when opened
                  value={formData.projects || []}
                  //handle selection
                  onChange={(event, value) =>
                    setFormData((prev) => ({
                      ...prev,
                      projects: value, // store full selected objects
                    }))
                  }
                  renderOption={(props, option, { selected }) => {
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        <Checkbox
                          checked={selected}
                        />
                        {option.projectName}
                      </li>
                    );
                  }}

                  renderInput={(params) => (
                    <TextField {...params} label="Projekten" placeholder="Projekten" />
                  )}
                />
              </Paper>

            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeAddDialog} color="secondary">Abbrechen</Button>
          {dialogMode === "add" ? (
            <Button onClick={handleAdd} sx={{ mr: 2 }} variant="contained" color="primary">
              Hinzufügen
            </Button>
          ) : (
            <Button onClick={updateContact} sx={{ mr: 2 }} variant="contained" color="primary">
              Aktualisieren
            </Button>
          )}
        </DialogActions>
      </Dialog>


      {/* ........................Show User Information................... */}
      <Dialog open={isDetailsDialogOpen}
        onClose={closeDetailsDialog}
        closeAfterTransition
        disableRestoreFocus
        fullWidth
        maxWidth="md"
      >
        <IconButton
          aria-label="close"
          onClick={closeDetailsDialog}
          sx={{ position: 'absolute', right: 8, top: 8, color: "GrayText" }}
        >
          <Close />
        </IconButton>
        <DialogTitle>Kontaktdetails</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small" aria-label="contact details" sx={{ borderCollapse: 'collapse' }}>
              <TableBody>
                {Object.entries(rowDetails)
                  .filter(([key]) => !['id', 'projects', 'companies', 'deletedAt'].includes(key))
                  .map(([key, value]) => {
                    const displayKey = keyNameMapping[key] || key;

                    // Helper: format value properly
                    const formatValue = (key, value) => {
                      if (!value) return '-';

                      // Format date fields
                      if (['createdAt', 'updatedAt', 'birthDate'].includes(key)) {
                        const date = new Date(value);
                        return isNaN(date)
                          ? value
                          : date.toLocaleDateString('de-CH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          });
                      }

                      // Handle companyIs / projectIs (stringified JSON)
                      if (key === 'companyIs' || key === 'projectIs') {
                        try {
                          const arr = typeof value === 'string' ? JSON.parse(value) : value;
                          if (!Array.isArray(arr) || arr.length === 0) return '-';
                          return (
                            <Stack direction="row" flexWrap="wrap" spacing={1}>
                              {arr.map((item) => (
                                <Chip
                                  key={item.id}
                                  label={item.companyName || item.projectName}
                                  color={key === 'companyIs' ? 'primary' : 'secondary'}
                                  variant="outlined"
                                  size="small"
                                />
                              ))}
                            </Stack>
                          );
                        } catch (e) {
                          return value;
                        }
                      }
                      return value;
                    };

                    return (
                      <TableRow key={key} sx={{ borderBottom: 'none' }}>
                        <TableCell
                          align="left"
                          width="150"
                          sx={{ borderBottom: 'none', padding: '8px 16px' }}
                        >
                          <strong>{displayKey}:</strong>
                        </TableCell>
                        <TableCell align="left" sx={{ borderBottom: 'none' }}>
                          {formatValue(key, value)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={closeDetailsDialog}>Schließen</Button>
        </DialogActions>
      </Dialog>


      {/* ............................Generate Pdf...................  */}
      <Dialog
        open={isPdfDialogOpen}
        onClose={closePdfDialog}
        closeAfterTransition
        disableRestoreFocus
        fullWidth
        maxWidth="xl">
        <IconButton
          aria-label="close"
          onClick={closePdfDialog}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'GrayText' }}>
          <Close />
        </IconButton>
        <DialogTitle>PDF Preview</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <ButtonGroup variant="outlined" aria-label="Basic button group">
                <Button onClick={addPriceField}> <AddCircle /></Button>
                <Button onClick={resetPriceFields} > <RemoveCircle /></Button>
                <Button onClick={() => buildPdf("png", selectedRow)}>Vorschau</Button>
                <Button variant="contained" color='primary' onClick={() => buildPdf("pdf", selectedRow)} >
                  Generate
                </Button>
              </ButtonGroup>

              <TextField
                label="Rechnungsnummer"
                fullWidth
                margin="normal"
                multiline
                value={invoiceNumber}
                size="small"
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />

              <TextField
                label="Kommentare hinzufügen"
                fullWidth
                margin="normal"
                multiline
                rows={2}
                value={comment}
                size="small"
                onChange={(e) => setComment(e.target.value)}
              />

              <TextField
                label="Preis Notiz"
                fullWidth
                margin="normal"
                multiline
                rows={1}
                value={priceNote}
                size="small"
                onChange={(e) => setPriceNote(e.target.value)}
              />

              {prices.map((item, index) => (
                <Grid container spacing={2} key={index} alignItems="center">
                  <Grid item xs={8}>
                    <TextField
                      label={`Beschreibung ${index + 1}`}
                      fullWidth
                      margin="normal"
                      size="small"
                      value={item.description || ""}
                      onChange={(e) => updatePrice(index, "description", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label={`Preis ${index + 1}`}
                      type="number"
                      fullWidth
                      margin="normal"
                      value={item.amount || ""}
                      size="small"
                      onChange={(e) => updatePrice(index, "amount", e.target.value)}
                    />
                  </Grid>
                </Grid>
              ))}

            </Grid>
            <Grid item xs={8}>
              <Paper sx={{ mt: 2, width: 'fit-content', maxHeight: '90vh', overflow: 'auto' }} elevation={3}>
                {loading && <CircularProgress />}
                <iframe
                  allowFullScreen
                  src={imageSrc}
                  title="PDF Preview"
                  style={{
                    display: loading ? 'none' : 'block',
                    width: '800px',
                    height: '1000px',
                    border: 'none',
                  }}
                  onLoad={() => setLoading(false)}
                />
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
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