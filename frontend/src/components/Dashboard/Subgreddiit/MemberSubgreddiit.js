import {
    Card,
    CardContent,
    CardMedia, List, ListItem, ListItemButton, ListItemText,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from "@mui/material";
import axios from "axios";
import {useEffect} from "react";
import {userinfo} from "../../../atoms/userinfo";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useRecoilState} from "recoil";
import Button from "@mui/material/Button";
import {SGinfo} from "../../../atoms/SGinfo";
import Grid2 from "@mui/material/Unstable_Grid2";
import cardimg from "../../../assets/download.jpeg";
import NewPost from "./NewPost/NewPost";
import PostButtons from "./PostButtons/PostButtons";


export default function MemberSubgreddiit() {
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
        <Grid2 container sx={{minHeight: '100%', width: '100%'}}>
            <Grid2 item sx={{width: '30%'}} className={'flex h-full justify-center'}>
                <Card sx={{width: '100%', height: '100%', marginLeft: '5%', marginRight: '5%', marginTop: '5%'}}>
                    <CardMedia
                        sx={{width: '100%', height: '0%', paddingTop: '56.25%', backgroundImage: `url(${cardimg})`}}
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
                    </CardContent>
                </Card>
            </Grid2>
            <Grid2 item sx={{width: '70%'}} className={'flex-col items-center justify-center'}>
                <NewPost/>
                <List sx={{width: '100%', color: 'white'}}>
                    {/*TODO Display posts*/}
                    {sg.posts.map(post => {
                        return (
                            <ListItem sx={{
                                display: 'flex',
                                width: '95%',
                                margin: '1%',
                                bgcolor: 'background.paper',
                                minHeight: '200px'
                            }}>
                                <PostButtons/>
                                <ListItemText
                                    primary={post.text}
                                />
                            </ListItem>
                        )
                    })}
                </List>
            </Grid2>
        </Grid2>
    )
}