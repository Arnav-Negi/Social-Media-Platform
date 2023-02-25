import Navbar from "./Navbar";
import Userinfo from "./Userinfo";
import {useEffect} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";
import {userinfo} from "../../atoms/userinfo";
import {setToken} from "../../utils/checkToken"
import axios from "axios";
import MySubgreddiits from "./MySubgreddiits";
import NewSubgreddiits from "./MySubgreddiits/NewSubgreddiits";
import EditProfile from "./Userinfo/EditProfile";
import AllSubgreddit from "./Subgreddiit/AllSubgreddit";
import MemberSubgreddiit from "./Subgreddiit/MemberSubgreddiit";
import SavedPosts from "./SavedPosts";
import Users from "./Subgreddiit/Users";
import JoinReqs from "./Subgreddiit/JoinReqs";
import Reports from "./Subgreddiit/Reports"
import Stats from "./Subgreddiit/Stats";

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
            <div className={"container min-h-screen w-screen"} >
                <Navbar/>
                <div className={"bg-orange-400 min-h-screen w-screen flex place-items-center justify-center"} >
                    <Routes>
                        <Route path={"/profile/subgreddiits/my"} element={<MySubgreddiits/>}/>
                        <Route path={"/profile/subgreddiits/new"} element={<NewSubgreddiits />} />
                        <Route path={"/profile/subgreddiits/all"} element={<AllSubgreddit />} />
                        <Route path={"/profile"} element={<Userinfo/>} />
                        <Route path={"/profile/saved"} element={<SavedPosts/>} />
                        <Route path={"/profile/edit"} element={<EditProfile />} />
                        <Route path={"/g/:id/member"} element={<MemberSubgreddiit />} />
                        <Route path={"/g/:id/users"} element={<Users />} />
                        <Route path={"/g/:id/join-reqs"} element={<JoinReqs />} />
                        <Route path={"/g/:id/reports"} element={<Reports />} />
                        <Route path={"/g/:id/stats"} element={<Stats />} />
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