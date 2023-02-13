import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {ButtonGroup, Paper, CssBaseline} from "@mui/material";
import {Typography} from "@mui/material";
import Login from "./Login";
import Signup from "./Signup";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {setToken, logout} from "../../utils/checkToken";
import {useRecoilState} from "recoil";
import {userinfo} from "../../atoms/userinfo"
import axios from "axios";

function GetAuthComponent(state) {
    if (state === 0) return (<Login/>)
    else return (<Signup/>)
}

export default function Auth() {
    const navigate = useNavigate();
    const authimg = require("../../assets/bg-auth.jpeg");
    const [user, setUser] = useRecoilState(userinfo);

    useEffect(() => {
        let err = setToken();
        if (err === 1) {
            navigate("/");
        } else {
            axios.get("/users/info").then((res) => {
                console.log()
                if (res.status === 200) {
                    setUser(res.data);
                    navigate("/profile");
                } else {
                    logout();
                    navigate("/");
                }
            }).catch((err => console.log(err)));
        }
    }, []);

    let [State, setState] = useState(0);
    let text;
    if (State == 0)
        text = "Login to GREDDIIT"
    else
        text = "Signup for GREDDIIT today!"
    return (
        <Grid container component="main" sx={{height: '100vh', width: '100vw'}}>
            <CssBaseline/>
            <Grid item component={Paper} className='w-5/12 h-full justify-items-center'>
                <Typography id="login-header"
                            sx={{
                                textAlign: "center",
                                placeItems: "center",
                                fontSize: "300%",
                                paddingTop: "5%",
                            }}>
                    {text}
                </Typography>
                <Paper variant={"elevation"} elevation={15}
                       className='flex relative right-1/4 left-1/4 w-1/2 rounded-3xl flex-wrap'
                       sx={{
                           height: "70%",
                           top: "10%",
                           bottom: "20%"
                       }}>
                    <div className={'flex relative w-full rounded-3xl'} style={{height: "10%"}}>
                        <ButtonGroup variant={"outlined"} color={"secondary"} className={'flex h-full w-full'}>
                            <Button className='flex-grow' onClick={() => setState(0)}
                                    sx={{backgroundColor: "black"}}>Login</Button>
                            <Button className='flex-grow' onClick={() => setState(1)} sx={{backgroundColor: "black"}}>Sign
                                Up</Button>
                        </ButtonGroup>
                    </div>
                    {GetAuthComponent(State)}
                </Paper>
            </Grid>
            <Grid item className='flex items-center justify-center align-middle flex-wrap h-full w-7/12'
                  style={{
                      backgroundImage: `url(${authimg})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundColor: (t) =>
                          t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                  }}>
                <h1 className={"font-black outline-black outline-4"} style={{
                    fontSize: "400%",
                    height: "10%",
                    border: "black",
                    textShadow: "1px"
                }}>
                    <strong>GREDDIIT</strong>
                </h1>
            </Grid>
        </Grid>
    )
}