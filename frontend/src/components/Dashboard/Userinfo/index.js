import {Paper, Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import SimpleDialog from "../SimpleDialog";
import axios from "axios";
import {useEffect} from "react";
import {userinfo} from "../../../atoms/userinfo";
import {useNavigate} from "react-router-dom";
import {setToken} from "../../../utils/checkToken";
import {useRecoilState} from "recoil";

export default function Userinfo() {
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userinfo);

    useEffect(() => {
        const result = setToken();
        if (result !== 0) navigate("/");
    }, []);

    return (
        <TableContainer
            variant={"elevation"}
            elevation={3}
            component={Paper}
            sx={{
                width: "40%"
            }}
        >
            <Table aria-label="simple table">
                <TableBody>
                    <TableRow
                        key={'firstname'}
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                        <TableCell component="th" scope="row" align="left" sx={{
                            fontSize: "120%",
                        }}>
                            First name
                        </TableCell>
                        <TableCell align="right" sx={{
                            fontSize: "120%",
                        }}>{user['firstname']}</TableCell>
                    </TableRow>
                    <TableRow
                        key={'lastname'}
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                        <TableCell component="th" scope="row" align="left" sx={{
                            fontSize: "120%",
                        }}>
                            Last name
                        </TableCell>
                        <TableCell align="right" sx={{
                            fontSize: "120%",
                        }}>{user['lastname']}</TableCell>
                    </TableRow>
                    <TableRow
                        key={'username'}
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                        <TableCell component="th" scope="row" align="left" sx={{
                            fontSize: "120%",
                        }}>
                            {'Username'}
                        </TableCell>
                        <TableCell align="right" sx={{
                            fontSize: "120%",
                        }}>{user['username']}</TableCell>
                    </TableRow>
                    <TableRow
                        key={'email'}
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                        <TableCell component="th" scope="row" align="left" sx={{
                            fontSize: "120%",
                        }}>
                            {'Email'}
                        </TableCell>
                        <TableCell align="right" sx={{
                            fontSize: "120%",
                        }}>{user['email']}</TableCell>
                    </TableRow>
                    <TableRow
                        key={'age'}
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                        <TableCell component="th" scope="row" align="left" sx={{
                            fontSize: "120%",
                        }}>
                            {'Age'}
                        </TableCell>
                        <TableCell align="right" sx={{
                            fontSize: "120%",
                        }}>{user['age']}</TableCell>
                    </TableRow>
                    <TableRow
                        key={'contact'}
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                        <TableCell component="th" scope="row" align="left" sx={{
                            fontSize: "120%",
                        }}>
                            {'Contact'}
                        </TableCell>
                        <TableCell align="right" sx={{
                            fontSize: "120%",
                        }}>{user['contact']}</TableCell>
                    </TableRow>
                    <TableRow key={"Followers"}
                              sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                        <TableCell component="th" scope="row" align="left" sx={{
                            fontSize: "120%",
                        }}>
                            {"Followers"}
                        </TableCell>
                        <TableCell align="right" sx={{
                            fontSize: "120%",
                        }}>
                            {user.followers.length}
                            <SimpleDialog names={user.followers.map((obj) => obj.username)}/>
                        </TableCell>
                    </TableRow>
                    <TableRow key={"Following"}
                              sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                        <TableCell component="th" scope="row" align="left" sx={{
                            fontSize: "120%",
                        }}>
                            {"Following"}
                        </TableCell>
                        <TableCell align="right" sx={{
                            fontSize: "120%",
                        }}>
                            {user.following.length}
                            <SimpleDialog names={user.following.map((obj) => obj['username'])}/>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}