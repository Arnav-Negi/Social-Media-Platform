import {useRecoilState} from "recoil";
import {userinfo} from "../../../atoms/userinfo";
import axios from "axios";
import {useEffect, useState} from "react";
import {
    Card,
    CardContent,
    FormControl, FormControlLabel, FormLabel,
    Radio, RadioGroup,
    Table, TableBody,
    TableCell,
    TableRow, TextField,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TagIcon from '@mui/icons-material/Tag';
import SearchIcon from '@mui/icons-material/Search';
import {Link} from 'react-router-dom';

function AscName(x, y) {
    if (x.name.toLowerCase() < y.name.toLowerCase()) {
        return -1;
    }
    if (x.name.toLowerCase() > y.name.toLowerCase()) {
        return 1;
    }
    return 0;
}

function DescName(x, y) {
    if (x.name.toLowerCase() < y.name.toLowerCase()) {
        return 1;
    }
    if (x.name.toLowerCase() > y.name.toLowerCase()) {
        return -1;
    }
    return 0;
}

function Members(x, y) {
    if (x.members.length < y.members.length) {
        return -1;
    }
    if (x.members.length > y.members.length) {
        return 1;
    }
    return 0;
}

function Created(x, y) {
    if (x.createdAt < y.createdAt) {
        return -1;
    }
    if (x.createdAt > y.createdAt) {
        return 1;
    }
    return 0;
}

export default function AllSubgreddit() {
    const [user, setUser] = useRecoilState(userinfo);

    const [sgList, setSgList] = useState([]);
    const [joinedSg, setJoinedSg] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [tags, setTags] = useState([]);
    const [sort, setSort] = useState("4");

    useEffect(() => {
        axios.get("/subg/all").then((res) => {
            setSgList(res.data);
            let tempList = []
            for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].members.includes(user._id))
                    tempList.push(res.data[i]);
            }
            setJoinedSg(tempList);
        }).catch(err => console.log(err));
    }, []);

    function LeaveSG(sg) {
        axios.post('/subg/leave', {
            sgID: sg._id
        }).then((res) => {
            console.log("Left from sub")
            console.log(sg)

            setJoinedSg([...(joinedSg.splice(joinedSg.indexOf(user._id), 1))]);
        }).catch(err => console.log(err));
    }

    function JoinSG(sg) {
        axios.post('/subg/join', {
            sgID: sg._id
        }).then((res) => {
            console.log("Sub asked to join")
            console.log(sg)
        }).catch(err => console.log(err));
    }


    function ImplementSearch(e) {
        e.preventDefault();
        let list = []

        axios.get("/subg/all").then((res) => {
            for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].name.toLowerCase().includes(searchText.toLowerCase())) {
                    list.push({...res.data[i]});
                }
            }

            if (tags.length !== 0)
            {
                let filterList = []
                for (var listKey in list) {
                    for (const tag in tags) {
                        if (listKey.tags.indexOf(tag) >= 0) {
                            filterList.push(listKey);
                        }
                    }
                }
                list = filterList;
            }

            switch (sort) {
                case "1":
                    list.sort(AscName)
                    break;
                case "2":
                    list.sort( DescName)
                    break;
                case "3":
                    list.sort(Members)
                    break;
                case "4":
                    list.sort(Created)
                    break;
                default:
            }

            let joined = [];
            for (let i = 0; i < list.length; i++) {
                if (list[i].members.includes(user._id))
                    joined.push(list[i]);
            }
            setSgList(list);
            setJoinedSg(joined);
            setSearchText("");
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <div className={'min-h-screen w-full justify-center'}>
            <div className="h-1/12 w-full flex justify-center" style={{paddingTop: '10%'}}>
                <div className="w-1/2 flex items-end" style={{padding: '1%', paddingLeft: '3%', paddingRight: '3%'}}>
                    <Button sx={{bgcolor: '#040404', height: '100%'}}
                            onClick={(e) => ImplementSearch(e)}><SearchIcon></SearchIcon></Button>
                    <TextField variant={'standard'} label={'Search'} fullWidth={true}
                               value={searchText} onChange={(e) => setSearchText(e.target.value)}
                               sx={{input: {color: 'white'}, bgcolor: '#040404'}}>
                        Search
                    </TextField>
                </div>
            </div>
            <div className="h-1/12 w-full flex justify-center">
                <div className="w-1/2 flex items-end" style={{padding: '1%', paddingLeft: '3%', paddingRight: '3%'}}>
                    <TagIcon></TagIcon>
                    <TextField variant={'standard'} label={'Tags (comma seperated)'} fullWidth={true}
                               value={tags} onChange={(e) => setTags(e.target.value.trim().split(","))}
                               sx={{input: {color: 'white'}, bgcolor: '#040404'}}>
                    </TextField>
                </div>
            </div>
            <div className="h-1/12 w-full flex justify-center">
                <div className="w-1/2 flex items-end bg-black" style={{padding: '1%', paddingLeft: '3%', paddingRight: '3%'}}>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Sort Subgreddits</FormLabel>
                        <RadioGroup
                            defaultValue={4}
                            name="radio-buttons-group"
                            onChange={event => {
                                setSort(event.target.value)
                            }}
                        >
                            <FormControlLabel value={"1"} control={<Radio/>} sx={{color: 'gray'}} label="Name ascending"/>
                            <FormControlLabel value={"2"} control={<Radio/>} sx={{color: 'gray'}} label="Name descending"/>
                            <FormControlLabel value={"3"} control={<Radio/>} sx={{color: 'gray'}} label="Members"/>
                            <FormControlLabel value={"4"} control={<Radio/>} sx={{color: 'gray'}} label="Creation Date"/>
                        </RadioGroup>
                    </FormControl>
                </div>
            </div>

            <Typography variant={'h2'} align={'center'} sx={{marginTop: '5%', marginBottom: '2%'}}>
                Joined Subgreddiits
            </Typography>
            <div className={'h-full w-full flex flex-wrap justify-center m-0'}>
                {joinedSg.map((sg) => (
                    <Card sx={{width: '40%', height: '50%', marginLeft: '5%', marginRight: '5%', marginTop: '5%'}}
                    component={Link} to={`/g/${sg._id}/member`}>
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
                                            align={'right'}>{sg.bannedWords.map((word) => word + ",")}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <div className="flex items-end" style={{height: '20%'}}>
                                <Grid container>
                                    <Grid item
                                          justifyContent="center"
                                          alignItems="flex-end" xs={6}>
                                        <Button variant={'outlined'} color={'error'}
                                                onClick={() => LeaveSG(sg)} disabled={sg.moderator === user._id}>
                                            <Typography color={'text.secondary'} fontSize={20}> LEAVE </Typography>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Typography variant={'h2'} align={'center'} sx={{marginTop: '5%', marginBottom: '2%'}}>
                All Subgreddiits
            </Typography>
            <div className={'w-full flex flex-wrap justify-center m-0'}>
                {sgList.map((sg) => (
                    <Card component={'div'}
                          sx={{
                              display: "block",
                              width: '40%',
                              height: '80%',
                              marginLeft: '5%',
                              marginRight: '5%',
                              marginTop: '5%'
                          }}
                          component={Link} to={`/g/${sg._id}/member`}>
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
                                            align={'right'}>{sg.bannedWords.map((word) => word + ",")}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <div className="flex items-end" style={{height: '20%'}}>
                                <Grid container>
                                    <Grid item
                                          justifyContent="center"
                                          alignItems="flex-end" xs={6}>
                                        <Button onClick={() => JoinSG(sg)} disabled={sg.members.includes(user._id)}
                                                variant={'outlined'}
                                                color={'success'}>
                                            <Typography color={'text.secondary'} fontSize={20}> JOIN </Typography>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </CardContent>
                    </Card>)
                )}
            </div>
        </div>
    )
}