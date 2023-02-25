import {Dialog, List, ListItem, ListItemButton, ListItemText, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import axios from "axios";
import {useRecoilState} from "recoil";
import {userinfo} from "../../../../atoms/userinfo";
import {SGinfo} from "../../../../atoms/SGinfo"


export default function NewReport(props) {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useRecoilState(userinfo);
    const [sg, setSg] = useRecoilState(SGinfo);
    const [formData, setFormData] = useState("");
    const {post} = props.post;
    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleSubmit = () => {
        axios.post('/report', {
            concern: formData,
            post: props.post._id
        }).then((res) => {
            alert("Report submitted.");
            setOpen(false);
        }).catch(err => {
            console.log(err);
            alert("Error in submitting post");
            setOpen(false);
        });
    }

    return (
        <div className={'flex justify-center'}>
            <Button variant={'contained'} color={'success'}
                    onClick={handleClickOpen}
                    sx={{
                        minHeight: '30%',
                        marginTop: '5%',
                        backgroundColor: 'black'
                    }}>
                <Typography color={'text.secondary'} fontSize={14}>REPORT</Typography>
            </Button>
            <Dialog onClose={handleClose} open={open} fullWidth={true}>
                <Typography variant={'h6'} sx={{marginLeft: '5%', marginRight: '5%', marginTop: '5%'}}>
                    Enter reason for report</Typography>
                <TextField value={formData} onChange={(e) => setFormData(e.target.value)}
                           multiline={true} rows={5} sx={{margin: '5%'}}
                >
                </TextField>
                <Button variant={'contained'} color={'success'}
                        onClick={handleSubmit} disabled={formData === ""}
                        sx={{
                            minHeight: '30%',
                            backgroundColor: 'black'
                        }}>
                    <Typography color={'text.secondary'} fontSize={20}>Send report</Typography>
                </Button>
            </Dialog>
        </div>
    );
};