import {
    atom
} from 'recoil';

export const SGinfo = atom({
    key: 'SGinfo',
    default: {
        _id: '',
        name: '',
        desc: '',
        tags: [],
        bannedWords: [],
        moderator: undefined,
        members: [],
        posts: [],
        banned: [],
        joinReqs: [],
        createdAt: ""
    }
})