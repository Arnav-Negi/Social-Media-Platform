import {Dialog, List, ListItem, ListItemText} from "@mui/material";
import {useState} from "react";
import Button from "@mui/material/Button";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

export default function SimpleDialog(props) {
    const [open, setOpen] = useState(false);
    const handleClose = (value) => {
        setOpen(false);
    };


    const handleClickOpen = () => {
        setOpen(true);
    };

    return (
        <div>
            <Button variant={"outlined"} onClick={() => setOpen(true)}>
                view
            </Button>
            <Dialog onClose={handleClose} open={open} fullWidth={true}>
                <List sx={{pt: 0}}>
                    {props.names.map((uname) => (
                        <ListItem disableGutters className={"pl-5"}>
                            <PersonRemoveIcon/>
                            <ListItemText primary={uname}  className={"pl-5"}/>
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        </div>
    );
};