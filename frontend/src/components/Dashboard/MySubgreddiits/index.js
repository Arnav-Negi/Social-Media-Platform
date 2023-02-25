import {Link, useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";
import {userinfo} from "../../../atoms/userinfo";
import {useEffect} from "react";
import {setToken} from "../../../utils/checkToken";
import axios from "axios";
import {Card, CardContent, CardMedia, Table, TableCell, TableBody, TableRow, Typography} from "@mui/material";
import cardimg from "../../../assets/download.jpeg";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";


export default function MySubgreddiits(props) {
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userinfo);
    const cardimg = require("../../../assets/download.jpeg");

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
        <div className={'min-h-screen w-full'}>
            <div className={'container flex justify-center w-full h-1/12'} style={{margin: '5%'}}>
                <Button variant={'contained'} color={'success'} component={Link} to={'/profile/subgreddiits/new'}
                        sx={{
                            maxHeight: '30%',
                            backgroundColor: 'black',
                            transform: 'translate(40%, 100%)'
                        }}>
                    <Typography color={'text.secondary'} fontSize={20}>CREATE NEW SUBG</Typography>
                </Button>
            </div>
            <div className={'h-full w-full flex flex-wrap justify-center m-0'}>
                {user.subgreddiits.map((sg) => (
                    <Card sx={{width: '30%', height: '70%', marginLeft: '5%', marginRight: '5%', marginTop: '5%'}}>
                        <CardMedia sx={{width: '100%', height: '0%', paddingTop: '56.25%', backgroundImage: `url(${cardimg})`}}
                                   title={'cardimg'}></CardMedia>
                        <CardContent sx={{
                            height: '60%'
                        }}>
                            <Typography sx={{height: '10%'}} noWrap={true}>
                                g/{sg.name}
                            </Typography>
                            <Typography variant={'body2'} paragraph={true} color={'text.secondary'}
                                        sx={{overflow: 'auto', height: '20%'}}>
                                {sg.desc}
                            </Typography>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align={'left'}>Number of posts</TableCell>
                                        <TableCell align={'right'}>{sg.posts.length}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align={'left'}>Number of users</TableCell>
                                        <TableCell align={'right'}>{sg.members.length}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align={'left'}>Banned Words</TableCell>
                                        <TableCell
                                            align={'right'}>{sg.bannedWords.join(', ')}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <div className="flex items-end" style={{height: '20%'}}>
                                <Grid container direction={'rows'}>
                                    <Grid item
                                          justifyContent="center"
                                          alignItems="flex-end" xs={6}>
                                        <Button component={Link} to={`/g/${sg._id}/users`} variant={'outlined'}
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