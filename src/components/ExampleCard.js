import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Box,
} from '@mui/material';


import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;
const ExampleCard = ({ nodeId, cancelLabel }) => {

    /*************** ePaper formData ***************/
    const [ePaperFormData, setEPaperFormData] = useState({});

    const handleChange = (e) => {
        setEPaperFormData({ ...ePaperFormData, [e.target.name]: e.target.value });
    };

    /*###################################### Save Label #######################################*/
    const saveLabel = async () => {
        try {
            // Create new row
            const response = await axios.post(`${apiUrl}/epaper/`, ePaperFormData);
        } catch (error) {
            console.log(error)
        }
    };
    /* ############################ Cancle and Reset Button Event ######################## */

    // const cancelLabel = () => {
    //     onDataChange('New data from child');
    // };

    const resetLabel = () => {

        // setAddNodeCard(false);
    };

    return (
        <Box>
            <Card>
                <CardHeader title="Add ePaper"></CardHeader>
                <Divider />
                <CardContent>
                    <Grid container spacing={2} rowSpacing={2}>
                        <Grid item xs={12} md={4} lg={4}>
                            <TextField
                                name="ePaperID"
                                label="EPaper ID"
                                value={ePaperFormData.storeCountry || ''}
                                onChange={handleChange}
                                fullWidth
                                margin="dense"
                            />
                            Sarwar: {nodeId}
                            <TextField
                                name="ePaperProvider"
                                label="Provider"
                                value={ePaperFormData.storeCode || ''}
                                onChange={handleChange}
                                fullWidth
                                margin="dense"
                            />

                            <TextField
                                name="ePaperPage"
                                label="Page"
                                value={ePaperFormData.storeCountry || ''}
                                onChange={handleChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <Box sx={{ my: 1 }}>
                    <Grid container spacing={2} rowSpacing={2}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Button onClick={saveLabel} variant="contained" color="secondary" sx={{ ml: 2 }}> Add</Button>
                            <Button onClick={resetLabel} variant="contained" color="secondary" sx={{ ml: 2 }}>Reset</Button>
                            <Button onClick={cancelLabel} variant="outlined" color="secondary" sx={{ ml: 2 }}>Cancle</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
        </Box>
    );
};

export default ExampleCard