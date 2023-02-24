import {
    atom
} from 'recoil';

export const userinfo = atom({
    key: 'userinfo',
    default: {
        _id: '',
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        age: undefined,
        contact: undefined,
        followers: [],
        following: [],
        subgreddiits: [],
        savedPosts: []
    }
})