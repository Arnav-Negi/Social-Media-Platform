import * as React from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {useState} from "react";

export default function PostButtons() {
    const [vote, setVote] = useState("");
    const [stats, setStats] = useState([]);

    const handleStats = (e, value) => {
        setStats(value);
    }

    const handleVotes = (e, value) =>  {
        setVote(value);
    }


    return (<div className={'mr-2'}>
            <ToggleButtonGroup
                value={stats}
                onChange={handleStats}
                orientation={'vertical'}
            >
                <ToggleButton value="saved" aria-label="bold">
                    <BookmarkIcon/>
                </ToggleButton>
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
                <ToggleButton value="upvoted" aria-label="color" disabled>
                    <ArrowUpwardIcon/>
                </ToggleButton>
                <ToggleButton value="downvoted" aria-label="italic">
                    <ArrowDownwardIcon/>
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}