import {useRecoilState} from "recoil";
import {userinfo} from "../../../atoms/userinfo";
import axios from "axios";
import {useEffect, useState} from "react";
import {
    Card,
    CardContent,
    CardMedia,
    Paper,
    Table,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";

export default function AllSubgreddit() {
    const [user, setUser] = useRecoilState(userinfo);

    const [sgList, setSgList] = useState([]);
    const [joinedSg, setJoinedSg] = useState([]);

    useEffect(() => {
        axios.get("/subg/all").then((res) => {
            setSgList(res.data);
            let tempList = []
            for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].members.includes(user._id))
                    tempList.push(res.data[i]);
            }
            console.log(res.data);
            setJoinedSg(tempList);
        }).catch(err => console.log(err));
    }, []);

    function deleteSub(sg) {
        axios.post('/subg/remove', {
            name: sg.name
        }).then((res) => {
            console.log("Sub deleted")
            console.log(sg)

            axios.get("users/info").then((res) => setUser(res.data));
        }).catch(err => console.log(err));
    }

    return (
        <div className={'min-h-full w-full justify-center'}>
            <Typography variant={'h4'} align={'center'} sx={{marginTop: '5%', marginBottom: '2%'}}>
                Joined Subgreddiits
            </Typography>
            <div className={'h-full w-full flex justify-center m-0'}>
                {joinedSg.map((sg) => (
                    <Card sx={{width: '40%', height: '50%', marginLeft: '5%', marginRight: '5%'}}>
                        <CardContent sx={{
                            height: '100%',
                            display: 'block'
                        }}>
                            <Typography sx={{height: '10%'}} noWrap={true}>
                                g/{sg.name}
                            </Typography>
                            <Typography variant={'body2'} noWrap={true} color={'text.secondary'}
                                        sx={{overflow: 'auto', height: '20%'}}>
                                {sg.desc}
                            </Typography>
                            <Table>
                                <TableRow>
                                    <TableCell align={'right'}>Number of posts</TableCell>
                                    <TableCell align={'right'}>{sg.posts.length}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align={'right'}>Number of users</TableCell>
                                    <TableCell align={'right'}>{sg.members.length}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align={'right'}>Banned Words</TableCell>
                                    <TableCell align={'right'}>{sg.bannedWords.map((word) => word + ",")}</TableCell>
                                </TableRow>
                            </Table>
                            <div className="flex items-end" style={{height: '20%'}}>
                                <Grid container>
                                    <Grid item
                                          justifyContent="center"
                                          alignItems="flex-end" xs={6}>
                                        <Button component={Link} to={`/g/${sg._id}`} variant={'outlined'}
                                                color={'success'}>
                                            <Typography color={'text.secondary'} fontSize={20}> OPEN </Typography>
                                        </Button>
                                    </Grid>
                                    <Grid item
                                          justifyContent="center"
                                          alignItems="flex-end" xs={6}>
                                        <Button variant={'outlined'} color={'error'} onClick={() => deleteSub(sg)}>
                                            <Typography color={'text.secondary'} fontSize={20}> DELETE </Typography>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Typography variant={'h4'} align={'center'} sx={{marginTop: '5%', marginBottom: '2%'}}>
                All Subgreddiits
            </Typography>
            <div className={'h-full w-full flex justify-center m-0'}>
                {joinedSg.map((sg) => (
                    <Card component={'div'}
                          sx={{display: "block", width: '40%', height: '80%', marginLeft: '5%', marginRight: '5%'}}>
                        <CardContent sx={{
                            height: '100%'
                        }}>
                            <Typography sx={{height: '10%'}} noWrap={true}>
                                g/{sg.name}
                            </Typography>
                            <Typography variant={'body2'} paragraph={true} noWrap={true} color={'text.secondary'}
                                        sx={{overflow: 'auto'}}>
                                {sg.desc}
                            </Typography>
                            <Table>
                                <TableRow>
                                    <TableCell align={'right'}>Number of posts</TableCell>
                                    <TableCell align={'right'}>{sg.posts.length}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align={'right'}>Number of users</TableCell>
                                    <TableCell align={'right'}>{sg.members.length}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align={'right'}>Banned Words</TableCell>
                                    <TableCell align={'right'}>{sg.bannedWords.map((word) => word + ",")}</TableCell>
                                </TableRow>
                            </Table>
                            <div className="flex items-end" style={{height: '20%'}}>
                                <Grid container>
                                    <Grid item
                                          justifyContent="center"
                                          alignItems="flex-end" xs={6}>
                                        <Button component={Link} to={`/g/${sg._id}`} variant={'outlined'}
                                                color={'success'}>
                                            <Typography color={'text.secondary'} fontSize={20}> OPEN </Typography>
                                        </Button>
                                    </Grid>
                                    <Grid item
                                          justifyContent="center"
                                          alignItems="flex-end" xs={6}>
                                        <Button variant={'outlined'} color={'error'} onClick={() => deleteSub(sg)}>
                                            <Typography color={'text.secondary'} fontSize={20}> DELETE </Typography>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}