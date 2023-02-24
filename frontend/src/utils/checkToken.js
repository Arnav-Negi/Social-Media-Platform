import axios from "axios";

const setToken = () => {
    let token = "";
    try {
        token = localStorage.getItem("accessToken");
    } catch { return 1;}
    if (token === null) return 1;
    axios.defaults.headers["x-auth-token"] = token;
    return 0;
}

const logout = () => {
    try {
        localStorage.removeItem("accessToken");
    } catch {}
    delete axios.defaults.headers.common["x-auth-token"];
}

export {setToken, logout};