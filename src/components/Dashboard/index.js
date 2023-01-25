import Navbar from "./Navbar";
import Userinfo from "./Userinfo";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const data = localStorage.getItem("session");
        console.log(data)
        if (data === null || data === false)
            navigate("/")
    }, []);

    return (
        <div>
            <Navbar />
            <div className={"bg-orange-400 h-screen flex place-items-center justify-center"}>
                <Userinfo />
            </div>
            <div className={"bg-red-300 h-screen"}></div>
        </div>
    )
}