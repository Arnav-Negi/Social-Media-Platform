import {AppBar, Typography, Container, Toolbar, Button, Box} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";

export default function Navbar() {
    const pages = ['Dashboard', 'Subgreddiits'];
    const pageToPath = {
        'Dashboard' : '/dashboard',
        'Subgreddiits' : '/dashboard'
    }
    const navigate = useNavigate();
    const [Path, setPath] = useState('Dashboard');

    function logout() {
        localStorage.setItem("session", false);
        navigate("/");
    }

    useEffect(() => {
            navigate(pageToPath[Path]);
    }, [Path]);

    return (
        <AppBar
            sx={{
                height: "5%",
                position: "fixed",
                backgroundColor: "black"
            }}
            className={" place-items-center"}>
            <Container maxWidth="xl">
                <Toolbar variant={"dense"} disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        GREDDIIT
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                sx={{my: 2, color: 'white', display: 'block'}}
                                onClick={() => setPath(page)}
                            >
                                {page}
                            </Button>
                        ))}
                        <Button
                            key={"logout"}
                            sx={{my: 2, color: 'white', display: 'block', alignSelf: "right"}}
                            onClick={() => logout()}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}