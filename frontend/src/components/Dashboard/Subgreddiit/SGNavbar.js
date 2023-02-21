import {AppBar, Typography, Container, Toolbar, Button, Box} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ForumIcon from '@mui/icons-material/Forum';
import LogoutIcon from '@mui/icons-material/Logout';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import ChatIcon from '@mui/icons-material/Chat';
import {logout} from "../../../utils/checkToken"
import {useRecoilState} from "recoil";
import {SGinfo} from "../../../atoms/SGinfo";

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

export default function Navbar(props) {
    const navigate = useNavigate();
    const [sg, setSg] = useRecoilState(SGinfo);

    return (
        <AppBar
            sx={{
                top: "7%",
                height: "7%",
                position: "fixed",
                backgroundColor: "black"
            }}
            className={" place-items-center"}>
            <Container maxWidth="xl">
                <Toolbar variant={"dense"} disableGutters>
                    <Typography align={'left'} variant={'h5'}>g/{sg.name}</Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex', justifyContent: 'flex-end'}}}>
                        <Button component={Link} to={`/g/${sg._id}/users`}
                                key={'Users'}
                                sx={{my: 2, color: 'white', display: 'block', paddingLeft: '1%'}}
                        >
                            {'Users'}
                        </Button>
                        <Button component={Link} to={`/g/${sg._id}/join-reqs`}
                                key={'Join Requests'}
                                sx={{my: 2, color: 'white', display: 'block', paddingLeft: '1%'}}
                        >
                            {'Join Requests'}
                        </Button>
                        <Button component={Link} to={`/g/${sg._id}/stats`}
                                key={'Stats'}
                                sx={{my: 2, color: 'white', display: 'block', paddingLeft: '1%'}}
                        >
                            {'Stats'}
                        </Button>
                        <Button component={Link} to={`/g/${sg._id}/reports`}
                                key={'Reports'}
                                sx={{my: 2, color: 'white', display: 'block', paddingLeft: '1%'}}
                        >
                            {'Reports'}
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}