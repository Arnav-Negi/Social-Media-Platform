import {Link, useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";
import {userinfo} from "../../../atoms/userinfo";
import {useEffect} from "react";
import {setToken} from "../../../utils/checkToken";
import axios from "axios";
import {Card, CardContent, CardMedia, Typography} from "@mui/material";
import authimg from "../../../assets/bg-auth.jpeg";
import cardimg from "../../../assets/download.jpeg";
import Button from "@mui/material/Button";


export default function MySubgreddiits(props) {
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userinfo);
    const cardimg = require("../../../assets/download.jpeg");

    useEffect(() => {
        const result = setToken();
        if (result !== 0) navigate("/");
        axios.get("users/info").then((res) => setUser(res.data))
    }, []);

    return (
        <div className={'h-full w-full'}>
            <div className={'container flex w-full h-1/12 mt-20'}>
                <Button variant={'contained'} color={'error'} component={Link} to={'/profile/subgreddiits/new'}
                sx={{
                    maxHeight: '30%',
                    backgroundColor: 'black',
                    transform: 'translate(50%, 100%)'
                }}>
                    <Typography color={'text.secondary'} fontSize={20}>CREATE NEW SUBG</Typography>
                </Button>
            </div>
            {user.subgreddiits.map((sg) => (
                <Card sx={{width: '25%', height: '40%', margin: '5%'}}>
                    <CardMedia sx={{width: '100%', height: '60%', backgroundImage:`url(${cardimg})`}} title={'cardimg'}></CardMedia>
                    <CardContent>
                        <Typography>
                            {sg.name}
                        </Typography>
                        <Typography variant={'body2'} color={'text.secondary'}>
                            {sg.desc}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}