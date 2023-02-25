import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {userinfo} from "../../../../atoms/userinfo";
import {useRecoilState} from "recoil";
import {SGinfo} from "../../../../atoms/SGinfo";
import Grid2 from "@mui/material/Unstable_Grid2";
import SGNavbar from "../SGNavbar";
import {useEffect} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";

export default function Users() {
    const [user, setUser] = useRecoilState(userinfo);
    const [sg, setSg] = useRecoilState(SGinfo);
    const {id} = useParams();

    useEffect(() => {
        axios.get(`/subg/${id}`).then((res) => {
            setSg(res.data);
            console.log(res.data);
        }).catch(err => console.log(err));
    }, []);

    return (
        <div className={"container flex min-h-screen w-screen"} style={{marginTop: '15%'}}>
            <SGNavbar/>
            <Grid2 container className={'min-h-screen w-screen flex justfiy-center place-items-center'}>
                <Grid2 item className={'w-1/2 min-h-screen flex-col justfiy-center place-items-center'}>
                    <Typography variant={'h4'}>
                        Members
                    </Typography>
                    <TableContainer
                        variant={"elevation"}
                        elevation={3}
                        component={Paper}
                        sx={{
                            width: "80%"
                        }}
                    >
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableCell>
                                    Username
                                </TableCell>
                                <TableCell>
                                    Email
                                </TableCell>
                            </TableHead>
                            <TableBody>
                                {sg.members.map(user => {
                                    return (
                                        <TableRow
                                            key={user.username}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell component="th" scope="row" align="left" sx={{
                                                fontSize: "120%",
                                            }}>
                                                <Typography color={'white'}>{user.username}</Typography>
                                            </TableCell>
                                            <TableCell component="th" scope="row" align="left" sx={{
                                                fontSize: "120%",
                                            }}>
                                                <Typography>{user.email}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid2>
                <Grid2 item className={'w-1/2 min-h-screen flex-col justfiy-center place-items-center'}>
                    <Typography variant={'h4'}>
                        Blocked users
                    </Typography>
                    <TableContainer
                        variant={"elevation"}
                        elevation={3}
                        component={Paper}
                        sx={{
                            width: "80%"
                        }}
                    >
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableCell>
                                    Username
                                </TableCell>
                                <TableCell>
                                    Email
                                </TableCell>
                            </TableHead>
                            <TableBody>
                                {sg.blocked.map(user => {
                                    return (
                                        <TableRow
                                            key={user.username}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell component="th" scope="row" align="left" sx={{
                                                fontSize: "120%",
                                            }}>
                                                {user.username}
                                            </TableCell>
                                            <TableCell component="th" scope="row" align="left" sx={{
                                                fontSize: "120%",
                                            }}>
                                                {user.email}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid2>

            </Grid2>
        </div>
    )
}