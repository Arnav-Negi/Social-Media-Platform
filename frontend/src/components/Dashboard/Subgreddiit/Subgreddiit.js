import {Routes, useNavigate, useParams} from "react-router-dom";
import {useRecoilState} from "recoil";
import {userinfo} from "../../../atoms/userinfo";
import {useEffect} from "react";
import axios from "axios";
import SGNavbar from "./SGNavbar";
import {SGinfo} from "../../../atoms/SGinfo";
import {Route} from "@mui/icons-material";
import Users from "./Users";


export default function Subgreddiit() {
    const navigate = useNavigate();
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
        <div className={"container h-screen w-screen"} style={{marginTop: '7%'}}>
            <SGNavbar/>
            <Routes>
                <Route path={"/users"} element={<Users />}/>
                {/*<Route path={"/"} element={<NewSubgreddiits/>}/>*/}
                {/*<Route path={"/"} element={<Userinfo/>}/>*/}
                {/*<Route path={"/*"} element={<Subgreddiit/>}/>*/}
            </Routes>
        </div>
    )
}