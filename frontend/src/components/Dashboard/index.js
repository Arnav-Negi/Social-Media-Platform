import Navbar from "./Navbar";
import Userinfo from "./Userinfo";
import {useEffect, useState} from "react";
import {Route, Routes, useNavigate, useParams} from "react-router-dom";
import {useRecoilState} from "recoil";
import {userinfo} from "../../atoms/userinfo";
import {setToken} from "../../utils/checkToken"
import axios from "axios";
import Auth from "../Auth";
import MySubgreddiits from "./MySubgreddiits";
import NewSubgreddiits from "./MySubgreddiits/NewSubgreddiits";

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userinfo);

    useEffect(() => {
        const result = setToken();
        if (result !== 0) navigate("/");

        axios.get("users/info").then((res) => setUser(res.data))
    }, []);

    if (user.username !== "")
        return (
            <div className={"container h-screen w-screen"} >
                <Navbar/>
                <div className={"bg-orange-400 h-screen w-screen fixed flex place-items-center justify-center"} sx={{height:'93%'}}>
                    <Routes>
                        <Route path={"/subgreddiits/my"} element={<MySubgreddiits/>}/>
                        <Route path={"/subgreddiits/new"} element={<NewSubgreddiits />} />
                        <Route path={"/"} element={<Userinfo />} />
                    </Routes>
                </div>
            </div>
        )
    else
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        )
}