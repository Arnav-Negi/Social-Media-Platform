import {ButtonGroup, FormControl, Paper, TextField, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {useState} from "react";

export default function Signup() {
    const [SignUpData, setSignUpData] = useState(
        {
            fname : "",
            lname : "",
            username : "",
            email : "",
            age : "",
            contact : "",
            password : ""
        }
    )


    return (
        <div className={"flex relative h-full w-full items-center justify-center"} style={{height:"90%"}}>
            <FormControl className={"font-light"} >
                <Grid container id="name-grid">
                    <Grid item xs={6}>
                        <TextField variant={"outlined"} sx={{padding: "5%", width: "100%", flex: "grow"}}
                                   id={"fname"} label={"First Name"}
                                   onChange={(e) => setSignUpData({...SignUpData, fname: e.target.value})}>
                            F. Name
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField variant={"outlined"} sx={{padding: "5%", width: "100%", flex: "grow"}}
                                   id={"lname"} label={"Last Name"}
                                   onChange={(e) => setSignUpData({...SignUpData, lname: e.target.value})}>
                            L. Name
                        </TextField>
                    </Grid>
                </Grid>

                <TextField variant={"outlined"} sx={{padding: "3%"}}
                           id={"username"} label={"Username"}
                           onChange={(e) => setSignUpData({...SignUpData, username: e.target.value})}>
                    Username
                </TextField>
                <TextField variant={"outlined"} sx={{padding: "3%"}} type={"email"}
                           id={"email"} label={"Email ID"}
                           onChange={(e) => setSignUpData({...SignUpData, email: e.target.value})}>
                    Email
                </TextField>
                <TextField variant={"outlined"} sx={{padding: "3%"}} type={"number"}
                           id={"age"} label={"Age"}
                           onChange={(e) => setSignUpData({...SignUpData, age: e.target.value})}>
                    Age
                </TextField>
                <TextField variant={"outlined"} sx={{padding: "3%"}} type={"tel"}
                           id={"contact"} label={"Contact"}
                           onChange={(e) => setSignUpData({...SignUpData, contact: e.target.value})}>
                    Contact
                </TextField>
                <TextField variant={"outlined"} sx={{padding: "3%"}} type={"password"}
                           id={"password"} label={"Password"}
                           onChange={(e) => setSignUpData({...SignUpData, password: e.target.value})}>
                    Password
                </TextField>
                <Button type={"submit"}
                        variant={"outlined"}
                        sx={{margin:"6%"}}
                        disabled={(SignUpData.username == "") || (SignUpData.password == "")}>
                    Login
                </Button>
            </FormControl>
        </div>
    )
}