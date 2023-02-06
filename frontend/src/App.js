import './App.css';
import Auth from './components/Auth/index';
import {CssBaseline} from "@mui/material";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {useState} from "react";
import Dashboard from "./components/Dashboard";

function App() {
    const theme = createTheme({palette: {mode: 'dark'}});

    return (

        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path={"/*"} element={<Auth />}/>
                    <Route path={"/profile"} element={<Dashboard />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>

    );
}

export default App;
