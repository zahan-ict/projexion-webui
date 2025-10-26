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
import CustomPagination from '../../components/CustomPagination'


const Project = () => {
  const { axiosInstance } = useAxiosInstance();
  const [rows, setRows] = useState([]);
  const [highlightedRowIds, setHighlightedRowIds] = useState([]); // State for tracking highlighted rows
  const [rowToDeleteId, setRowToDeleteId] = useState(null);


  /*###################################### Load All Data On Page Load #######################################*/
  const [dataLoading, setDataLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const [rowCount, setRowCount] = useState(0);

  const fetchData = useCallback(async ({ page, pageSize }) => {
    if (pageSize <= 0) return; // Ensure pageSize is always > 0
    setDataLoading(true);
    try {
      const response = await axiosInstance.get(`/projects/paging?pageIndex=${page}&pageSize=${pageSize}`);
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
      field: 'title',
      headerName: 'Title',
      renderHeader: () => <strong>Title</strong>,
      width: 300,
      flex: 1,
      cellClassName: (params) => (highlightedRowIds.includes(params.id) ? 'bold' : 'normal'),
    },
    {
      field: 'productionYear',
      headerName: 'Jahr',
      renderHeader: () => <strong>Jahr</strong>,
      width: 300,
      flex: 1,
      cellClassName: (params) => (highlightedRowIds.includes(params.id) ? 'bold' : 'normal'),
    },

    {
      field: 'country',
      headerName: 'Land',
      renderHeader: () => <strong>Land</strong>,
      width: 150,
      flex: 1,
      cellClassName: (params) => (highlightedRowIds.includes(params.id) ? 'bold' : 'normal'),
    },

    {
      field: 'actions',
      headerName: 'Actions',
      renderHeader: () => <strong>Actions</strong>,
      width: 190,
      renderCell: (params) => (
        <Stack direction="row" alignItems="right" spacing={2}>
          <IconButton onClick={() => openDetailsDialog(params.row)} size="medium" aria-label="link" color="primary"><VisibilityOutlined fontSize='inherit' /></IconButton>
          <IconButton onClick={() => openEditDialog(params.row)} size="medium" color="primary"><Edit fontSize='inherit' /></IconButton>
          <IconButton onClick={() => openDeleteDialog(params.id)} size="medium" color="primary"><Delete fontSize='inherit' /></IconButton>
        </Stack>
      ),
    },
  ];
  /*###################################### Add Project #######################################*/

  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [dialogMode, setDialogMode] = useState("add");

  const openAddDialog = () => {
    setDialogMode("add");
    setErrors({});
    setFormData({});
    setIsAddProjectOpen(true);
  };

  const closeAddDialog = () => {
    setIsAddProjectOpen(false);;
  };


  // --- Generic change handler for all TextFields ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error when typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ----------------- Validate fields (customize as needed) ----------------
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title || formData.title.trim() === "") {
      newErrors.title = "Titel ist erforderlich";
    }
    if (!formData.productionYear) {
      newErrors.productionYear = "Produktionsjahr ist erforderlich";
    }
    return newErrors;
  };

  // ####################################### Add project ####################################### 
  const handleAddProject = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    try {
      setDataLoading(true);
      await axiosInstance.post("/projects", formData);
      await fetchData(paginationModel);
      setOpen(true);          // success snackbar
      closeAddDialog();       // close dialog
    } catch (error) {
    } finally {
      setDataLoading(false);
    }
  };

  //####################################### Update Project ####################################### 
  const handleUpdateProject = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    try {
      setDataLoading(true);
      await axiosInstance.put(`/projects/${formData.id}`, formData);
      await fetchData(paginationModel);
      setOpen(true);
      closeAddDialog();
    } catch (error) {
      console.error("Error updating project:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const openEditDialog = (rowData) => {
    setFormData(rowData || {});
    setErrors({});
    setDialogMode("edit");
    setIsAddProjectOpen(true);
  };

  /*###################################### Delete Rack #######################################*/
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const handleDeleteRow = async (id) => {
    try {
      const idToDelete = rowToDeleteId;
      if (idToDelete !== null) {
        const updatedRows = rows.filter((row) => row.id !== idToDelete);
        await axiosInstance.delete(`/projects/${idToDelete}`);
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
    setRowDetails(rowData);
    setIsDetailsDialogOpen(true);
  };

  const closeDetailsDialog = () => {
    setHighlightedRowIds([]);
    setRowDetails({});
    setIsDetailsDialogOpen(false);
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
    // Allgemeine Informationen
    title: "Titel",
    productionYear: "Produktionsjahr",
    country: "Land",
    aka: "Alternativer Titel (AKA)",
    origVers: "Originalversion",
    versInfo: "Versionsinfo",
    production: "Produktion",
    status: "Status",
    minutes: "Minuten",
    meters: "Meter",
    formats: "Formate",
    movieId: "Film-ID",

    // Crew
    regie: "Regie",
    incharge: "Verantwortlich",
    inchargeSec: "Zweitverantwortlich",
    bookAuthor: "Buchautor",
    coAuthor: "Co-Autor",

    // Termine
    premiereDate: "Premiere-Datum",
    cinemaStartDate: "Kinostart-Datum",
    tvStartDate: "TV-Start-Datum",

    // Beschreibungen
    synopsisDe: "Synopsis (DE)",
    festivalInfo: "Festival-Informationen",
    awards: "Auszeichnungen",
    eingabenFoerderer: "Eingaben Förderer",
    kopien: "Kopien",

    // Technische Informationen
    tonstudio: "Tonstudio",
    mischung: "Mischung",
    weitereTonbearbeitung: "Weitere Tonbearbeitung",
    videotechnik: "Videotechnik",
    schnittassi: "Schnittassistenz",
    schnitt: "Schnitt",
    weitereBildbearbeitung: "Weitere Bildbearbeitung",
    stereodolby: "Stereodolby",
    formatDreh: "Format (Dreh)",
    formatSchnitt: "Format (Schnitt)",
    auswertung: "Auswertung",
    filmformat: "Filmformat",
    bildformat: "Bildformat",
    labor: "Labor",
    tonsystem: "Tonsystem",
    negmont: "Negativmontage",

    //  Links & Metadaten
    vodLink: "VOD-Link",
    screenerLink: "Screener-Link",
    trailerLink: "Trailer-Link",
    webKeywords: "Web-Schlüsselwörter",
    isan: "ISAN",
    imdb: "IMDb-Link",

    // Zeitstempel
    createdAt: "Erstellt am",
    updatedAt: "Aktualisiert am",
    deletedAt: "Gelöscht am"
  };


  const formatValue = (key, value) => {
    if (!value) return "-";

    // Format ISO date/time fields
    if (["createdAt", "updatedAt", "deletedAt"].includes(key)) {
      const date = new Date(value);
      return isNaN(date)
        ? value
        : date.toLocaleString("de-DE", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
    }

    // Plain date fields
    if (["premiereDate", "cinemaStartDate", "tvStartDate"].includes(key)) {
      const date = new Date(value);
      return isNaN(date)
        ? value
        : date.toLocaleDateString("de-DE", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
    }
    // Default
    return value;
  };




  return (
    <Box>
      <Ribbon
        addElement={(openAddDialog)}
        handleExport={""}
        refreshElement={() => fetchData(paginationModel)}
        route={"projekt"} />

      {/*....................Add and Update Project............... */}
      <Dialog
        open={isAddProjectOpen}
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
        <DialogTitle> {dialogMode === "add" ? "Projekt hinzufügen" : "Projekt bearbeiten"}</DialogTitle>
        <DialogContent dividers sx={{ maxHeight: "80vh", overflowY: "auto" }}>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <Paper sx={{ mt: 1, p: 3 }} elevation={3}>
                <Grid container spacing={3}>

                  {/* Projektinformationen */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Projektinformationen
                    </Typography>
                  </Grid>

                  {[
                    { name: "title", label: "Titel" },
                    { name: "productionYear", label: "Produktionsjahr" },
                    { name: "country", label: "Land" },
                    { name: "aka", label: "Alternativer Titel (AKA)" },
                    { name: "origVers", label: "Originalversion" },
                    { name: "versInfo", label: "Versionsinfo" },
                    { name: "production", label: "Produktion" },
                    { name: "status", label: "Status" },
                    { name: "minutes", label: "Minuten" },
                    { name: "meters", label: "Meter" },
                    { name: "formats", label: "Formate" },
                    { name: "movieId", label: "Film ID" },
                  ].map((f) => (
                    <Grid item xs={12} sm={4} key={f.name}>
                      <TextField
                        fullWidth
                        label={f.label}
                        name={f.name}
                        value={formData[f.name] ?? ""}
                        onChange={handleChange}
                        error={Boolean(errors[f.name])}
                        helperText={errors[f.name] || " "}
                      />
                    </Grid>
                  ))}

                  {/* Crew */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
                      Crew
                    </Typography>
                  </Grid>

                  {[
                    { name: "regie", label: "Regie" },
                    { name: "incharge", label: "Verantwortlich" },
                    { name: "inchargeSec", label: "Zweitverantwortlich" },
                    { name: "bookAuthor", label: "Buchautor" },
                    { name: "coAuthor", label: "Co-Autor" },
                  ].map((f) => (
                    <Grid item xs={12} sm={4} key={f.name}>
                      <TextField
                        fullWidth
                        label={f.label}
                        name={f.name}
                        value={formData[f.name] ?? ""}
                        onChange={handleChange}
                      />
                    </Grid>
                  ))}

                  {/* Beschreibungen */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
                      Beschreibungen
                    </Typography>
                  </Grid>

                  {[
                    { name: "synopsisDe", label: "Synopsis (DE)" },
                    { name: "festivalInfo", label: "Festival-Informationen" },
                    { name: "awards", label: "Auszeichnungen" },
                    { name: "eingabenFoerderer", label: "Eingaben Förderer" },
                    { name: "kopien", label: "Kopien" },
                  ].map((f) => (
                    <Grid item xs={12} key={f.name}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label={f.label}
                        name={f.name}
                        value={formData[f.name] ?? ""}
                        onChange={handleChange}
                      />
                    </Grid>
                  ))}

                  {/* Technische Informationen */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
                      Technische Informationen
                    </Typography>
                  </Grid>

                  {[
                    { name: "tonstudio", label: "Tonstudio" },
                    { name: "mischung", label: "Mischung" },
                    { name: "weitereTonbearbeitung", label: "Weitere Tonbearbeitung" },
                    { name: "videotechnik", label: "Videotechnik" },
                    { name: "schnittassi", label: "Schnittassistenz" },
                    { name: "schnitt", label: "Schnitt" },
                    { name: "weitereBildbearbeitung", label: "Weitere Bildbearbeitung" },
                    { name: "stereodolby", label: "Stereodolby" },
                    { name: "formatDreh", label: "Format (Dreh)" },
                    { name: "formatSchnitt", label: "Format (Schnitt)" },
                    { name: "auswertung", label: "Auswertung" },
                    { name: "filmformat", label: "Filmformat" },
                    { name: "bildformat", label: "Bildformat" },
                    { name: "labor", label: "Labor" },
                    { name: "tonsystem", label: "Tonsystem" },
                    { name: "negmont", label: "Negativmontage" },
                  ].map((f) => (
                    <Grid item xs={12} sm={4} key={f.name}>
                      <TextField
                        fullWidth
                        label={f.label}
                        name={f.name}
                        value={formData[f.name] ?? ""}
                        onChange={handleChange}
                      />
                    </Grid>
                  ))}

                  {/* Links & Metadaten */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
                      Links & Metadaten
                    </Typography>
                  </Grid>

                  {[
                    { name: "vodLink", label: "VOD-Link" },
                    { name: "screenerLink", label: "Screener-Link" },
                    { name: "trailerLink", label: "Trailer-Link" },
                    { name: "webKeywords", label: "Web-Schlüsselwörter" },
                    { name: "isan", label: "ISAN" },
                    { name: "imdb", label: "IMDb-Link" },
                  ].map((f) => (
                    <Grid item xs={12} sm={4} key={f.name}>
                      <TextField
                        fullWidth
                        label={f.label}
                        name={f.name}
                        value={formData[f.name] ?? ""}
                        onChange={handleChange}
                      />
                    </Grid>
                  ))}

                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper sx={{ mt: 1, p: 3 }} elevation={3}>
                {/* Termine */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{
                    fontWeight: 600,
                    mb: 2
                  }}>
                    Termine
                  </Typography>
                </Grid>
                <Grid container spacing={3}>
                  {[
                    { name: "premiereDate", label: "Premiere Datum" },
                    { name: "cinemaStartDate", label: "Kinostart Datum" },
                    { name: "tvStartDate", label: "TV-Start Datum" },
                  ].map((f) => (
                    <Grid item xs={12} sm={12} key={f.name}>
                      <TextField
                        fullWidth
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        label={f.label}
                        name={f.name}
                        value={formData[f.name] ?? ""}
                        onChange={handleChange}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>

        </DialogContent>

        <DialogActions>
          <Button onClick={closeAddDialog} color="secondary">Abbrechen</Button>
          {dialogMode === "add" ? (
            <Button onClick={handleAddProject} sx={{ mr: 2 }} variant="contained" color="primary">
              Hinzufügen
            </Button>
          ) : (
            <Button onClick={handleUpdateProject} sx={{ mr: 2 }} variant="contained" color="primary">
              Aktualisieren
            </Button>
          )}
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
          Projekt erfolgreich gespeichert
        </Alert></Snackbar>

      {/*..............................Project Details Dialog............................. */}
      <Dialog open={isDetailsDialogOpen}
        onClose={closeDetailsDialog}
        closeAfterTransition={true}
        disableRestoreFocus
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            minHeight: "95%",     // keeps it from collapsing vertically
            transition: "none",     // prevents flicker on unmount
          },
        }}
      >
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

        <DialogTitle>Projekt Informationen</DialogTitle>
        <DialogContent dividers>
          <TableContainer>
            <Table size="small" aria-label="a dense table" sx={{ borderCollapse: 'collapse' }}>
              <TableBody>
                {Object.entries(rowDetails)
                  .filter(([key]) => key !== "deletedAt")
                  .map(([key, value]) => {
                    const displayKey = keyNameMapping[key] || key;
                    return (
                      <TableRow key={key}>
                        <TableCell sx={{ borderBottom: 'none' }}><strong>{displayKey}:</strong></TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}>{formatValue(key, value)}</TableCell>
                      </TableRow>
                    );
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
        fullWidth
        maxWidth="xl"
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
          <Typography> Möchten Sie diesen Projekt wirklich löschen?</Typography>
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

export default Project