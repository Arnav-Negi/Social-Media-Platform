import {AppBar, Typography, Container, Toolbar, Button, Box} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ForumIcon from '@mui/icons-material/Forum';
import LogoutIcon from '@mui/icons-material/Logout';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import ChatIcon from '@mui/icons-material/Chat';
import {logout} from "../../../utils/checkToken"

function getIcon(string) {
    const icons = {
        'Profile': <AccountCircleIcon sx={{fontSize: '200%', paddingRight: '4%'}}/>,
        'Subgreddiit': <ForumIcon sx={{fontSize: '200%', paddingRight: '4%'}}/>,
        'My Subgreddiits' : <ChatIcon sx={{fontSize: '200%', paddingRight: '4%'}}/>,
        'Saved' : <BookmarksIcon sx={{fontSize: '200%', paddingRight: '4%'}}/>,
        'Logout': <LogoutIcon sx={{fontSize: '200%', paddingRight: '4%'}}/>
    };

    return (icons[string]);
}

export default function Navbar() {
    const pages = ['Profile', 'Subgreddiit', 'My Subgreddiits', 'Saved'];
    const pageToPath = {
        'Profile': '/profile',
        'Subgreddiit': '/profile',
        'My Subgreddits': '/profile',
        'Saved': '/profile'
    };

    const navigate = useNavigate();
    const [Path, setPath] = useState('Dashboard');

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
                            display: {xs: 'none', md: 'flex'},
                            fontFamily: 'monospace',
                            fontSize: '200%',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        GREDDIIT
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex', justifyContent: 'flex-end'}}}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                sx={{my: 2, color: 'white', display: 'block', paddingLeft : '1%'}}
                                onClick={() => setPath(page)}
                            >
                                {getIcon(page)}
                                {page}
                            </Button>
                        ))}

                        <Button
                            key={"logout"}
                            sx={{my: 2, color: 'white', display: 'block', alignSelf: "right"}}
                            onClick={() => {logout();navigate("/")}}
                        >
                            {getIcon("Logout")}
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}