import {AppBar, Typography, Container, Toolbar, Button, Box} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
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
        'My Subgreddiits': <ChatIcon sx={{fontSize: '200%', paddingRight: '4%'}}/>,
        'Saved': <BookmarksIcon sx={{fontSize: '200%', paddingRight: '4%'}}/>,
        'Logout': <LogoutIcon sx={{fontSize: '200%', paddingRight: '4%'}}/>
    };

    return (icons[string]);
}

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <AppBar
            sx={{
                height: "7%",
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
                        <Button component={Link} to={'/profile'}
                                key={'Profile'}
                                sx={{my: 2, color: 'white', display: 'block', paddingLeft: '1%'}}
                        >
                            {getIcon('Profile')}
                            {'Profile'}
                        </Button>
                        <Button component={Link} to={'/profile/subgreddiits/all'}
                                key={'Subgreddiit'}
                                sx={{my: 2, color: 'white', display: 'block', paddingLeft: '1%'}}
                        >
                            {getIcon('Subgreddiit')}
                            {'Subgreddiit'}
                        </Button>
                        <Button component={Link} to={'/profile/subgreddiits/my'}
                                key={'My Subgreddiits'}
                                sx={{my: 2, color: 'white', display: 'block', paddingLeft: '1%'}}
                        >
                            {getIcon('My Subgreddiits')}
                            {'My Subgreddiits'}
                        </Button>
                        <Button component={Link} to={'/profile/saved'}
                                key={'Saved'}
                                sx={{my: 2, color: 'white', display: 'block', paddingLeft: '1%'}}
                        >
                            {getIcon('Saved')}
                            {'Saved'}
                        </Button>
                        <Button
                            key={"logout"}
                            sx={{my: 2, color: 'white', display: 'block', alignSelf: "right"}}
                            onClick={() => {
                                logout();
                                navigate("/")
                            }}
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