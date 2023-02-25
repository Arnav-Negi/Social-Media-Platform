import {
    List,
    ListItem, ListItemButton,
    ListItemText, Typography
} from "@mui/material";
import {userinfo} from "../../../../atoms/userinfo";
import {useRecoilState} from "recoil";
import {SGinfo} from "../../../../atoms/SGinfo";
import SGNavbar from "../SGNavbar";
import {useEffect} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";


export default function JoinReqs() {
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
        <div className={"container flex-col justify-center place-items-center min-h-screen w-screen"}
             style={{marginTop: '15%'}}>
            <SGNavbar/>
        </div>
    )
}