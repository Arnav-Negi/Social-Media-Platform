import {FormControl, Paper, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {useState} from "react";
import axios from "axios";
import {useRecoilState} from "recoil";
import {userinfo} from "../../../atoms/userinfo";
import {Link} from "react-router-dom";

export default function EditProfile() {
    const [text, setText] = useState("");
    const [user, setUser] = useRecoilState(userinfo);

    const [SignUpData, setSignUpData] = useState(
        {
            username : user.username,
            firstname : user.firstname,
            lastname : user.lastname,
            age : user.age,
            contact : user.contact
        }
    )

    function handleSubmit() {
        console.log(SignUpData);
        axios.post('/users/update', SignUpData).then((res) => {
            setText("Update successful!");
            setUser({...user,  ...SignUpData})
        }).catch((err) => {
            console.log(err);
            alert("Error: wrong input");
        });
    }

    return (
        <Paper elevation={2} className={"flex relative bg-black items-center justify-center"} sx={{padding:'5%'}}>
            <FormControl className={"font-light"}
                         onSubmit={handleSubmit}>
                <Grid container id="name-grid">
                    <Grid item xs={6}>
                        <TextField variant={"outlined"} sx={{padding: "5%", width: "100%", flex: "grow"}}
                                   id={"fname"} label={"First Name"} defaultValue={user.firstname}
                                   onChange={(e) => setSignUpData({...SignUpData, firstname: e.target.value})}>
                            F. Name
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField variant={"outlined"} sx={{padding: "5%", width: "100%", flex: "grow"}}
                                   id={"lname"} label={"Last Name"} defaultValue={user.lastname}
                                   onChange={(e) => setSignUpData({...SignUpData, lastname: e.target.value})}>
                            L. Name
                        </TextField>
                    </Grid>
                </Grid>

                <TextField variant={"outlined"} sx={{padding: "3%"}}
                           id={"username"} label={"Username"} defaultValue={user.username}
                           onChange={(e) => setSignUpData({...SignUpData, username: e.target.value})}>
                    Username
                </TextField>
                <TextField variant={"outlined"} sx={{padding: "3%"}} type={"number"}
                           id={"age"} label={"Age"} defaultValue={user.age}
                           onChange={(e) => setSignUpData({...SignUpData, age: e.target.value})}>
                    Age
                </TextField>
                <TextField variant={"outlined"} sx={{padding: "3%"}} type={"number"}
                           id={"contact"} label={"Contact"} defaultValue={user.contact}
                           onChange={(e) => setSignUpData({...SignUpData, contact: (e.target.value)})}>
                    Contact
                </TextField>
                <Button type={"submit"} component={Link}
                        variant={"outlined"} to={'/profile'}
                        sx={{margin:"6%"}}
                        onClick={handleSubmit}
                        disabled={(SignUpData.username === "")}>
                    Update
                </Button>
            </FormControl>
        </Paper>
    )
}