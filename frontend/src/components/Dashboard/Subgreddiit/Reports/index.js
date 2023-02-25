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

export default function Reports() {
    const [user, setUser] = useRecoilState(userinfo);
    const [sg, setSg] = useRecoilState(SGinfo);
    const {id} = useParams();

    useEffect(() => {
        axios.get(`/subg/${id}`).then((res) => {
            setSg(res.data);
            console.log(res.data);
        }).catch(err => console.log(err));
    }, []);

    const handleIgnore = (report) => {
        axios.post('/report/ignore', {
            report: report._id
        }).then(res => {
            let temp = [...sg.reports]
            for (let i = 0; i < temp.length; i++) {
                if (temp[i]._id === report._id) {
                    let tempReport = {...temp[i]};
                    temp.splice(i, 1);
                    temp.push({...tempReport, ignored: true});
                    break;
                }
            }
            setSg({...sg,  reports: temp})
        }).catch(err => console.log(err));
    }

    const handleBlock = (report) => {
        axios.post('/report/block', {
            report: report._id
        }).then(res => {
            console.log("User blocked.");
        }).catch(err => console.log(err));
    }

    const handleDelete = (report) => {
        axios.post('/report/delete', {
            report: report._id
        }).then(res => {
            const postid = report.post;
            let tempPost = sg.posts;
            for (let i = 0; i < tempPost.length; i++) {
                if (tempPost[i]._id === postid) {
                    tempPost.splice(i, 1);
                    break;
                }
            }
            let tempReports = [];
            for (let i = 0; i < sg.reports; i++) {
                if (sg.reports[i].post._id !== postid) {
                    tempReports.push(sg.reports[i]);
                }
            }

            setSg({...sg,  reports: tempReports, posts: tempPost});
        }).catch(err => console.log(err));
    }

    return (
        <div className={"container flex-col justify-center place-items-center min-h-screen w-screen"}
             style={{marginTop: '15%'}}>
            <SGNavbar/>
            <Typography variant={'h4'}>Reports</Typography>
            <List sx={{minWidth: '95%', maxWidth: 360, bgcolor: 'background.paper'}}>
                <ListItem key={user._id} >
                    <ListItemText primary={'Reported user'} sx={{color: 'white'}}/>
                    <ListItemText primary={'Reported by'} sx={{color: 'white'}}/>
                    <ListItemText primary={'Reason'} sx={{color: 'white'}}/>
                    <ListItemText primary={'Post'} sx={{color: 'white'}}/>
                </ListItem>
                {sg.reports.map((report) => {
                    return (
                        <div>
                        <ListItem key={report._id} sx={{paddingTop: '16px'}}>
                            <ListItemText primary={`${report.reported.username}`} sx={{color: 'white'}}/>
                            <ListItemText primary={`${report.reportedBy.username}`} sx={{color: 'white'}}/>
                            <ListItemText primary={`${report.concern}`} sx={{color: 'white'}}/>
                            <ListItemText primary={`${report.post.text}`} sx={{color: 'white'}}/>
                        </ListItem>
                        <ListItem key={report._id + ':'} >
                            <ListItemButton sx={{bgcolor: 'grey'}} disabled={report.ignored} onClick={() => handleIgnore(report)}>
                                IGNORE
                            </ListItemButton>
                            <ListItemButton sx={{bgcolor: 'blue'}} disabled={report.ignored} onClick={() => handleBlock(report)}>
                                BLOCK
                            </ListItemButton>
                            <ListItemButton sx={{bgcolor: 'red'}} disabled={report.ignored} onClick={() => handleDelete(report)}>
                                DELETE
                            </ListItemButton>
                        </ListItem>
                        </div>
                    );
                })}
            </List>
        </div>
    )
}