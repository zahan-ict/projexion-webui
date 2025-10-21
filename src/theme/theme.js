import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    primary: {
      light: '#565858ff',
      main: '#424343ff',
      dark: '#2f3030ff',
      contrastText: '#fff',
      lightDarkText: 'rgba(209, 205, 194, 1)',
    },
      secondary: {
      light: '#565858ff',
      main: '#424343ff',
      dark: '#2f3030ff',
      contrastText: '#fff',
      lightDarkText: 'rgba(209, 205, 194, 1)',
    },
  },


  components: {
    // MuiButton: {
    //   styleOverrides: {
    //     root: {
    //       fontSize: '.9rem',
    //     },
    //   },
    // },

    MuiDataGrid: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
          },
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell': {
            paddingLeft: '10px',
            fontSize: '14px',
          },
          '& .MuiDataGrid-columnHeader': {
            paddingLeft: '10px',     
            fontWeight: 'bold',
            fontSize: '14px',
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          marginBottom: '15px', // Adjust the bottom margin as needed
        },
      },
    },

    MuiCardHeader: {
      styleOverrides: {
        root: {
          paddingTop: '8px',  // Adjust the padding of the CardHeader
          marginTop: '5px', 
          marginLeft: '5px' // Add margin below the CardHeader
        },
        title: {
          fontSize: '0.98rem',  // Adjust the font size of the title
          color:'GrayText'
        },
        subheader: {
          fontSize: '1rem',  // Adjust the font size of the subheader
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          paddingTop: '10px',  
          paddingBottom: '20px',
          marginBottom:'10px'
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorInherit: {
          backgroundColor: '#fff',
          color: '#000',
        },
      },
    },
  },
});

export default theme;