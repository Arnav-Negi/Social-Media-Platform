import './App.css';
import Auth from './components/Auth/index';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import {
    RecoilRoot
} from 'recoil';
import axios from "axios";

function App() {
    const theme = createTheme({
        palette: {mode: 'dark'},
        components: {}
    });

    axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    axios.defaults.headers = {
        "Content-type": "application/json"
    }

    return (
        <RecoilRoot>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <Routes>
                            <Route path={"/"} element={<Auth/>}/>
                            <Route path={"/*"} element={<Dashboard/>}/>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </RecoilRoot>

    );
}

export default App;
