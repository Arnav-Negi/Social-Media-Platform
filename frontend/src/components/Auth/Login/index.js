import {Box, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from 'axios';

export default function Login() {
    const navigate = useNavigate();
    const [Errors, setErrors] = useState("");
    const [LoginData, setLoginData] = useState(
        {
            username: "",
            password: ""
        }
    )

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            username: data.get('username'),
            password: data.get('password')
        });

        axios.post(`users/login`, {
            username: data.get('username'),
            password: data.get('password')
        }).then(
            (res) => {
                const token = res.headers['x-auth-token'];
                if (token && token !== "") {
                    console.log("Setting token : " + token)
                    localStorage.setItem("accessToken", token)
                    navigate(`/profile`)
                } else {
                    setLoginData({username: "", password: ""});
                }
            }
        ).catch(
            (err) => {
                console.log(err)
                setErrors("Incorrect password / username.")
                setLoginData({username: "", password: ""});
            }
        )
    }

    return (
        <div className={"flex relative h-full w-full items-center justify-center"} style={{height: "90%"}}>
            <Box component={"form"} className={"font-light flex flex-col justify-items-center"} onSubmit={handleSubmit}>
                <TextField variant={"outlined"}
                           sx={{padding: "3%"}}
                           value={LoginData.username}
                           name={"username"}
                           onChange={(e) => setLoginData({...LoginData, username: e.target.value})}
                           label={"Username"}>
                    username
                </TextField>
                <TextField variant={"outlined"}
                           sx={{padding: "3%"}}
                           type={"password"}
                           value={LoginData.password}
                           name={"password"}
                           onChange={(e) => setLoginData({...LoginData, password: e.target.value})}
                           label={"Password"}
                           error={Errors !== ""}
                           helperText={Errors}>
                    Password
                </TextField>
                <Button type={"submit"} variant={"outlined"} sx={{margin: "6%"}}
                        disabled={(LoginData.username === "") || (LoginData.password === "")}>
                    Login
                </Button>
            </Box>
        </div>
    )
}