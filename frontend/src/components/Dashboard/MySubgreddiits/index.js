import {Link, useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";
import {userinfo} from "../../../atoms/userinfo";
import {useEffect} from "react";
import {setToken} from "../../../utils/checkToken";
import axios from "axios";
import {Card, CardContent, CardMedia, Typography} from "@mui/material";
import cardimg from "../../../assets/download.jpeg";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";


export default function MySubgreddiits(props) {
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userinfo);
    const cardimg = require("../../../assets/download.jpeg");

    useEffect(() => {
        const result = setToken();
        if (result !== 0) navigate("/");
        axios.get("users/info").then((res) => setUser(res.data))
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
        <div className={'h-full w-full'}>
            <div className={'container flex justify-center w-full h-1/12'} style={{margin: '5%'}}>
                <Button variant={'contained'} color={'success'} component={Link} to={'/profile/subgreddiits/new'}
                        sx={{
                            maxHeight: '30%',
                            backgroundColor: 'black',
                            transform: 'translate(50%, 100%)'
                        }}>
                    <Typography color={'text.secondary'} fontSize={20}>CREATE NEW SUBG</Typography>
                </Button>
            </div>
            <div className={'h-full w-full flex'}>
                {user.subgreddiits.map((sg) => (
                    <Card sx={{width: '25%', height: '40%', marginLeft: '5%'}}>
                        <CardMedia sx={{width: '100%', height: '60%', backgroundImage: `url(${cardimg})`}}
                                   title={'cardimg'}></CardMedia>
                        <CardContent sx={{
                            height: '40%'
                        }}>
                            <Typography sx={{height: '20%'}} noWrap={true}>
                                g/{sg.name}
                            </Typography>
                            <Typography variant={'body2'} paragraph={true} color={'text.secondary'}
                                        sx={{ overflow: 'auto', height:'40%'}}>
                                {sg.desc}
                            </Typography>
                            <div className="flex items-end" style={{height: '40%'}}>
                                <Grid item direction="row"
                                      justifyContent="center"
                                      alignItems="flex-end" xs={6}>
                                    <Button component={Link} variant={'outlined'} color={'success'}>
                                        <Typography color={'text.secondary'} fontSize={20}> OPEN </Typography>
                                    </Button>
                                </Grid>
                                <Grid item direction="row"
                                      justifyContent="center"
                                      alignItems="flex-end" xs={6}>
                                    <Button variant={'outlined'} color={'error'} onClick={() => deleteSub(sg)}>
                                        <Typography color={'text.secondary'} fontSize={20}> DELETE </Typography>
                                    </Button>
                                </Grid>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}