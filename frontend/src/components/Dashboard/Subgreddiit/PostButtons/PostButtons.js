import * as React from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {userinfo} from "../../../../atoms/userinfo";
import {SGinfo} from "../../../../atoms/SGinfo";
import axios from "axios";
import {useParams} from "react-router-dom";

function modifyList(list, thing) {
    const index = list.indexOf(thing);
    let temp = [...list];
    if (index === -1 ){
        temp.push(thing);
    }
    else {
        temp.splice(index, 1);
    }
    return temp;
}

export default function PostButtons(props) {
    const [vote, setVote] = useState("");
    const [saved, setSaved] = useState("");
    const [follow, setFollow] = useState("");
    const {post} = props;
    const [postState, setPostState] = useState(post);
    const [user, setUser] = useRecoilState(userinfo);

    useEffect(() => {
        if (postState.upvoteUsers.includes(user._id)) setVote("upvoted")
        if (postState.downvoteUsers.includes(user._id)) setVote("downvoted");

        if (user.savedPosts.includes(postState._id)) setSaved("saved");
        if (user.following.includes(postState.poster)) setFollow("followed");
    }, []);


    const toggleSaved = (e, value) => {
        axios.post('/users/save', {
            post: postState._id
        }).then(res => {
            if (res.status === 200) {
                setSaved(value);
                setUser({...user, savedPosts: modifyList(user.savedPosts, user._id)})
            }
            else alert("Couldn't save post.");
        }).catch(err => console.log(err));
    }

    const handleVotes = (e, value) => {
        if (value === "upvoted") {
            axios.post('/posts/upvote', {
                post: postState._id
            }).then(res => {
                if (res.status === 200) {
                    setVote(value);
                    console.log(postState.upvoteUsers)
                    setPostState({...postState, upvoteUsers: modifyList(postState.upvoteUsers, user._id)})
                    console.log(postState.upvoteUsers)
                }
                else alert("Couldn't upvote post.");

            }).catch(err => console.log(err));
        }
        else {
            axios.post('/posts/downvote', {
                post: postState._id
            }).then(res => {
                if (res.status === 200) {
                    setVote(value);
                    setPostState({...postState, downvoteUsers: modifyList(postState.downvoteUsers, user._id)})
                }
                else alert("Couldn't downvote post.");
            }).catch(err => console.log(err));
        }
    }

    const toggleFollow = (e, value) => {
        axios.post('/follow', {
            following : postState.poster
        }).then(res => {
            if (res.status === 200) {
                setFollow(value);
                setUser({...user,  following: modifyList(user.following, postState.poster)});
            }
            else alert("Couldn't follow user.");
        }).catch(err => console.log(err));
    }


    return (<div className={'mr-2 flex-col flex-wrap'}>
            <ToggleButtonGroup value={saved} onChange={toggleSaved} orientation={'vertical'}>
                <ToggleButton value="saved" aria-label="bold" onChange={toggleFollow}>
                    <BookmarkIcon/>
                </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
                value={follow}
                onChange={toggleFollow}
                orientation={'vertical'}
            >
                <ToggleButton value="followed" aria-label="italic">
                    <PersonAddIcon/>
                </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
                exclusive
                value={vote}
                onChange={handleVotes}
                orientation={'vertical'}
            >
                <ToggleButton value="upvoted" aria-label="color">
                    <ArrowUpwardIcon/>
                    {postState.upvoteUsers.length}
                </ToggleButton>
                <ToggleButton value="downvoted" aria-label="italic">
                    <ArrowDownwardIcon/>
                    {postState.downvoteUsers.length}
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}