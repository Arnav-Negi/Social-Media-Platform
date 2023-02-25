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
import axios from "axios";
import {ButtonGroup} from "@mui/material";
import Button from "@mui/material/Button";

function modifyList(list, thing) {
    const index = list.indexOf(thing);

    let temp = [...list];
    if (index === -1) {
        temp.push(thing);
    } else {
        temp.splice(index, 1);
    }
    return temp;
}

export default function PostButtons(props) {
    const [upvote, setUpvote] = useState([]);
    const [downvote, setDownvote] = useState([]);
    const [saved, setSaved] = useState([]);
    const [follow, setFollow] = useState([]);
    const [postState, setPostState] = useState(props.post);
    const [user, setUser] = useRecoilState(userinfo);
    const [listPosts, setListPosts] = useState([...user.savedPosts.map(post => post._id)]);

    useEffect(() => {
        if (postState.upvoteUsers.includes(user._id)) setUpvote(["upvote"])
        else setUpvote([])
        if (postState.downvoteUsers.includes(user._id)) setDownvote(["downvote"]);
        else setDownvote([]);

        if (listPosts.includes(postState._id)) setSaved(["save"]);
        else setSaved([]);
        if (user.following.includes(postState.poster._id)) setFollow(["follow"]);
        else setFollow([])
    }, [user, postState, listPosts]);


    const toggleSaved = (e, value) => {
        axios.post('/users/save', {
            post: postState._id
        }).then(res => {
            if (res.status === 200) {
                setListPosts( modifyList(listPosts, postState._id));
            } else alert("Couldn't save post.");
        }).catch(err => console.log(err));
    }

    const handleDownvotes = (e, value) => {
        axios.post('/posts/vote', {
            post: postState._id,
            action: "downvote"
        }).then(res => {
            if (upvote.length !== 0) {
                setPostState({...postState, upvoteUsers: modifyList(postState.upvoteUsers, user._id),
                    downvoteUsers: modifyList(postState.downvoteUsers, user._id)});
            }
            else {
                setPostState({...postState, downvoteUsers: modifyList(postState.downvoteUsers, user._id)})
            }
        }).catch(err => console.log(err));
    }

    const handleUpvotes = (e, value) => {
        axios.post('/posts/vote', {
            post: postState._id,
            action: "upvote"
        }).then(res => {
            if (downvote.length !== 0) {
                setPostState({...postState, upvoteUsers: modifyList(postState.upvoteUsers, user._id),
                    downvoteUsers: modifyList(postState.downvoteUsers, user._id)});
            }
            else {
                setPostState({...postState, upvoteUsers: modifyList(postState.upvoteUsers, user._id)})
            }
        }).catch(err => console.log(err));
    }


    const toggleFollow = (e, value) => {
        axios.post('/follow', {
            following: postState.poster.username,
            username: user.username
        }).then(res => {
            if (res.status === 200) {
                setUser({...user, following: modifyList(user.following, postState.poster._id)});
            } else alert("Couldn't follow user.");
        }).catch(err => console.log(err));
    }


    return (<div className={'mr-2 flex-col'}>
            <ToggleButtonGroup value={saved} onChange={toggleSaved}>
                <ToggleButton value="save" aria-label="bold" onChange={toggleFollow}>
                    <BookmarkIcon/>
                </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
                value={follow}
                onChange={toggleFollow}
            >
                <ToggleButton value="follow" aria-label="italic">
                    <PersonAddIcon/>
                </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
                value={upvote}
                onChange={handleUpvotes}
            >
                <ToggleButton value="upvote" aria-label="color">
                    <ArrowUpwardIcon/>
                    {postState.upvoteUsers.length}
                </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
                value={downvote}
                onChange={handleDownvotes}
            >
                <ToggleButton value="downvote" aria-label="italic">
                    <ArrowDownwardIcon/>
                    {postState.downvoteUsers.length}
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}