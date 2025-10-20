import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, Grid } from "@mui/material";

export default function ProjektErzeugunForm() {
  const [formData, setFormData] = useState({
    title: "",
    productionYear: "",
    country: "",
    origVers: "",
    versAuswertung: "",
    produzent: "",
    regie: "",
    verantwortlicher: "",
    stellvertreter: "",
    drehbuchautor: "",
    coAutor: "",
    premiere: "",
    kinostart: "",
    tvPremiere: "",
    synopsisDe: "",
    festival: "",
    awards: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let temp = {};
    temp.title = formData.title ? "" : "Title is required.";
    temp.country = formData.country ? "" : "Country is required.";
    setErrors(temp);
    return Object.values(temp).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch("https://api.example.com/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Form submitted successfully!");
        setFormData({
          title: "",
          productionYear: "2023",
          country: "",
          origVers: "",
          versAuswertung: "",
          produzent: "",
          regie: "",
          verantwortlicher: "",
          stellvertreter: "",
          drehbuchautor: "",
          coAutor: "",
          premiere: "",
          kinostart: "",
          tvPremiere: "",
          synopsisDe: "",
          festival: "",
          awards: "",
        });
      } else {
        alert("Submission failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box>
      <Typography color="secondary.dark" className="topTitle">
        Projekt Erzeugun
      </Typography>
      <Paper sx={{ transition: "height 0.3s ease", mt: 2, p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Produktionsjahr"
                name="productionYear"
                value={formData.productionYear}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                fullWidth
                error={!!errors.country}
                helperText={errors.country}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Orig. Vers. (Dreh)"
                name="origVers"
                value={formData.origVers}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Vers. Auswertung"
                name="versAuswertung"
                value={formData.versAuswertung}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Produzent"
                name="produzent"
                value={formData.produzent}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Regie"
                name="regie"
                value={formData.regie}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Verantwortlicher"
                name="verantwortlicher"
                value={formData.verantwortlicher}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Stellvertreter"
                name="stellvertreter"
                value={formData.stellvertreter}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Drehbuchautor"
                name="drehbuchautor"
                value={formData.drehbuchautor}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Co-Autor"
                name="coAutor"
                value={formData.coAutor}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Premiere"
                name="premiere"
                type="date"
                value={formData.premiere}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Kinostart"
                name="kinostart"
                type="date"
                value={formData.kinostart}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="TV-Premiere"
                name="tvPremiere"
                type="date"
                value={formData.tvPremiere}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Synopsis De"
                name="synopsisDe"
                value={formData.synopsisDe}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Festival"
                name="festival"
                value={formData.festival}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Awards"
                name="awards"
                value={formData.awards}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sx={{ textAlign: "right", mt: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
