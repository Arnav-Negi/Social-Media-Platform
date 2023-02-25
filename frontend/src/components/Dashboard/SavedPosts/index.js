import { List, ListItem, ListItemText,
    Typography
} from "@mui/material";
import {userinfo} from "../../../atoms/userinfo";
import {useRecoilState} from "recoil";
import PostButtons from "../Subgreddiit/PostButtons/PostButtons";
import NewComment from "../Subgreddiit/NewPost/NewComment";
import NewReport from "../Subgreddiit/NewReport/NewReport";


export default function SavedPosts() {
    const [user, setUser] = useRecoilState(userinfo);

    return (
        <div className={'w-screen p-4'}>
            <Typography variant={'h3'} >Saved Posts: ({user.savedPosts.length})</Typography>
        <List sx={{width: '100%', color: 'white', display: 'flex', flexDirection: 'column'}}>
            {user.savedPosts.map(post => {
                return (
                    <ListItem sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        width: '95%',
                        margin: '1%',
                        bgcolor: 'background.paper',
                        minHeight: '200px'
                    }}>
                        <PostButtons post={post}/>
                        <NewReport post={post}/>
                        <Typography variant={'h5'}>{"u/" + post.poster.username}</Typography>
                        <ListItemText
                            primary={post.text}
                        />
                        <Typography variant={'body2'}>comments ({post.comments.length}): </Typography>
                        <NewComment post={post} />
                    </ListItem>
                )
            })}
        </List>
        </div>
    )
}