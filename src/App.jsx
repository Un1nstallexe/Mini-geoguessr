import "./App.css";
import SvgMap from "./components/SvgMap/SvgMap";
import { useEffect } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


const App = () => { 

    return (
        <div className="App">
            <ThemeProvider theme={darkTheme}>
                <SvgMap/>
            </ThemeProvider>
        </div>
    );
}

export default App;
