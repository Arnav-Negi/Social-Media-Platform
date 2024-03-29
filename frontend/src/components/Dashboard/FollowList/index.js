import {Dialog, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import axios from "axios";
import {useRecoilState} from "recoil";
import {userinfo} from "../../../atoms/userinfo";


export default function FollowList(props) {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useRecoilState(userinfo);
    const [list, setList] = useState(props.names);
    const type = props.type
    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const toggleFollow = (name) => {
        if (type === 'following') {
        axios.post("/follow", {
            username: user.username,
            following: name
        }).then((res) => {
            const listTemp = list;
            listTemp.splice(listTemp.indexOf(name), 1);
            setList(listTemp);
            setUser({...user,  following: list});
        }).catch((err) => console.log(err)) }
        else if (type === 'followers') {
            axios.post("/follow/remove", {
                username: user.username,
                follower: name
            }).then((res) => {
                const listTemp = list;
                listTemp.splice(listTemp.indexOf(name), 1);
                setList(listTemp);
                setUser({...user,  following: list});
            }).catch((err) => console.log(err)) }
        }

    if (list.length > 0)
        return (
            <div>
                {list.length}
                <Button variant={"outlined"} onClick={handleClickOpen} sx={{marginLeft:'2%'}}>
                    view
                </Button>
                <Dialog onClose={handleClose} open={open} fullWidth={true}>
                    <List sx={{pt: 0}}>
                        {list.map((uname) => (
                            <ListItem disableGutters className={"pl-5"} key={uname}>
                                <ListItemButton onClick={() => toggleFollow(uname)} sx={{
                                    maxWidth: "10%"
                                }}>
                                    <PersonRemoveIcon />
                                </ListItemButton>
                                <ListItemText primary={uname} className={"pl-5"} />
                            </ListItem>
                        ))}
                    </List>
                </Dialog>
            </div>
        );
    else return (<div>
        {list.length}
        <Button variant={"outlined"} onClick={handleClickOpen} sx={{marginLeft:'2%'}}>
            view
        </Button>
    </div>)
};