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

function deleteWithId(list, id) {
    let temp = [...list]
    for (let i = 0; i < temp.length; i++) {
        if (temp[i]._id === id) return temp.splice(i, 1 );
    }
    return temp
}

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

    const handleButton = (user, action) => {
        axios.post("/subg/resolve", {
            subgreddiit: sg._id,
            joining: user._id,
            action: action
        }).then(res => {
            if (action === "accept") {
                setSg({...sg,  joinReqs: [...deleteWithId(sg.joinReqs, user._id)],
                members: [...sg.members, user]});
            }
            else {
                setSg({...sg,  joinReqs: [...deleteWithId(sg.joinReqs, user._id)]});
            }
            alert("Successful");
        }).catch(err => console.log(err));
    };

    return (
        <div className={"container flex-col justify-center place-items-center min-h-screen w-screen"}
             style={{marginTop: '15%'}}>
            <SGNavbar/>
            <Typography variant={'h4'}>Joining Requests</Typography>
            <List sx={{minWidth: '95%', maxWidth: 360, bgcolor: 'background.paper'}}>
                <ListItem key={user._id}>
                    <ListItemText primary={'Username'} sx={{color: 'white'}}/>
                    <ListItemText primary={'Name'} sx={{color: 'white'}}/>
                    <ListItemText primary={'Email'} sx={{color: 'white'}}/>
                    <ListItemText sx={{color: 'white'}}/>
                    <ListItemText sx={{color: 'white'}}/>
                    <ListItemText sx={{color: 'white'}}/>
                </ListItem>
                {sg.joinReqs.map((user) => {
                    return (
                        <ListItem key={user._id}>
                            <ListItemText primary={`${user.username}`} sx={{color: 'white'}}/>
                            <ListItemText primary={`${user.firstname} ${user.lastname}`} sx={{color: 'white'}}/>
                            <ListItemText primary={`${user.email}`} sx={{color: 'white'}}/>
                            <ListItemButton sx={{bgcolor: 'green'}} onClick={() => handleButton(user, "accept")}>
                                ACCEPT
                            </ListItemButton>
                            <ListItemButton sx={{bgcolor: 'red'}} onClick={() => handleButton(user, "reject")}>
                                REJECT
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    )
}