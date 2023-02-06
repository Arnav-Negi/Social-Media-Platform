import {Paper, Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import SimpleDialog from "../SimpleDialog";

export default function Userinfo() {
    const Fields = ['First Name', 'Last Name', 'Username', 'Email', 'Age', 'Contact']

    const Info = {
        'First Name': "Arnav",
        'Last Name': "Negi",
        'Username': "admin",
        'Email': "arnavnegi14@gmail.com",
        'Age': "19",
        'Contact': "9995834220",
        'Password': "admin"
    }

    const Followers = ['Rohan', 'Prakul', 'Shiven', 'Sakshat'];
    const Following = ['Akshit', 'Prakul', 'Shiven'];

    return (
        <TableContainer
            variant={"elevation"}
            elevation={3}
            component={Paper}
            sx={{
                width: "40%"
            }}
        >
            <Table aria-label="simple table">
                <TableBody>
                    {Fields.map((field) => (
                        <TableRow
                            key={field}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row" align="left" sx={{
                                fontSize: "120%",
                            }}>
                                {field}
                            </TableCell>
                            <TableCell align="right" sx={{
                                fontSize: "120%",
                            }}>{Info[field]}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow key={"Followers"}
                              sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                        <TableCell component="th" scope="row" align="left" sx={{
                            fontSize: "120%",
                        }}>
                            {"Followers"}
                        </TableCell>
                        <TableCell align="right" sx={{
                            fontSize: "120%",
                        }}>
                            {Followers.length}
                            <SimpleDialog names={Followers} />
                        </TableCell>
                    </TableRow>
                    <TableRow key={"Followers"}
                              sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                        <TableCell component="th" scope="row" align="left" sx={{
                            fontSize: "120%",
                        }}>
                            {"Following"}
                        </TableCell>
                        <TableCell align="right" sx={{
                            fontSize: "120%",
                        }}>
                            {Following.length}
                            <SimpleDialog names={Following} />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}