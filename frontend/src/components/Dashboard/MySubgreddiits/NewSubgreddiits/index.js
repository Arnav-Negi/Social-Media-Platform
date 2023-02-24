import { useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";
import {userinfo} from "../../../../atoms/userinfo";
import {useEffect, useState} from "react";
import {setToken} from "../../../../utils/checkToken";
import axios from "axios";
import Button from "@mui/material/Button";
import {Box, FormControl, TextField, Typography} from "@mui/material";


export default function NewSubgreddiits(props) {
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userinfo);

    const [SubData, setSubData] = useState({
        name: "",
        desc: "",
        tags: [],
        bannedWords: []
    });

    const [text, setText] = useState("");
    const [valid, setValid] = useState(true);
    const [errText, setErrText] = useState({
        tags: "",
        bannedWords: ""
    });

    function Validate() {
        setValid(true)
        SubData.bannedWords.forEach((word) => {
            if (word.indexOf(' ') >= 0) {
                setErrText({...errText, bannedWords: "Single words only"});
                setValid(false);
            }
        })

        SubData.tags.forEach((word) => {
            if (word.indexOf(' ') >= 0) {
                setErrText({...errText, tags: "Single words only"});
                setValid(false);
            }
        })
        console.log(SubData)
        handleSubmit();
    }

    function handleSubmit() {
        if (!valid) return;

        console.log(SubData)
        axios.post('/subg', SubData).then((res) => {
            setText("NewPost Subgreddiit created !");
            axios.get("users/info").then((res) => setUser(res.data)).catch(err => console.log(err));
        }).catch(err => console.log(err))
        setSubData({
            name: "",
            desc: "",
            tags: [],
            bannedWords: []
        })
    }

    return (
        <div className={'bg-black w-1/2 h-3/4'}>
            <Box component={'div'} className={"items-center justify-center p-5 h-full w-full rounded-2xl"}>
                <FormControl className={"font-light w-full h-full"}
                             onSubmit={handleSubmit}>

                    <TextField variant={"outlined"} sx={{marginLeft: "5%", marginRight: "5%", marginTop: '3%', width: '50%'}}
                               id={"name"} label={"Subgreddiit name"}
                               onChange={(e) => setSubData({...SubData, name: e.target.value})}
                               value={SubData.name}>
                        Name
                    </TextField>
                    <TextField variant={"outlined"} sx={{marginLeft: "5%", marginRight: "5%", marginTop: '3%'}}
                               type={"number"}
                               id={"desc"} label={"Description"} multiline rows={7}
                               onChange={(e) => setSubData({...SubData, desc: e.target.value})}
                                value={SubData.desc}>
                        Description
                    </TextField>
                    <TextField variant={"outlined"} sx={{marginLeft: "5%", marginRight: "5%", marginTop: '3%'}} type={"text"}
                               id={"bannedWords"} label={"Banned Words (comma seperated list)"} error={errText.bannedWords !== ""}
                               helperText={errText.bannedWords}
                               onChange={(e) => setSubData({...SubData, bannedWords: e.target.value.split(',')})}
                               value={SubData.bannedWords}>
                        Banned Words
                    </TextField>
                    <TextField variant={"outlined"} sx={{marginLeft: "5%", marginRight: "5%", marginTop: '3%'}} type={"text"}
                               id={"tags"} label={"Tags (comma seperated list)"} error={errText.tags !== ""} helperText={errText.tags}
                               onChange={(e) => setSubData({...SubData, tags: e.target.value.split(',')})}
                               value={SubData.tags}>
                        Tags
                    </TextField>
                    <Typography>{text}</Typography>
                    <Button type={"submit"}
                            variant={"outlined"}
                            sx={{margin: "6%"}} color={'secondary'}
                            onClick={() => { Validate();}}
                            disabled={(SubData.name === "") || (SubData.desc === "")}>
                        Create Subgreddiit
                    </Button>
                </FormControl>
            </Box>
        </div>
    )
}