import React, { useState } from "react";
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    FormControlLabel,
    Checkbox,
    Link,
    Grid,
    Box,
    Typography,
    makeStyles,
    Container,
} from "@material-ui/core";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { LockOutlined } from "@material-ui/icons";
import { authenticate } from "./helpers"





function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
      </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}
const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function ResetPassword(props) {
    const classes = useStyles();
    const token = props.match.params.token

    const [values, setValues] = useState({
        newPassword: "",
        confirmNewPassword: "",
        buttonText: "Reset Password",
    });
    const { newPassword, confirmNewPassword, buttonText } = values;

    const handleInputChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });
    };

    const siginSubmit = (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: "Loading.." });
        axios({
            method: "PUT",
            url: `${process.env.REACT_APP_API}/users/reset_password/${token}`,
            data: { newPassword, confirmNewPassword },
        })
            .then((res) => {
                setValues({ ...values, buttonText: "SUCCESSFULL" })
                toast.success(res.data.message)
                props.history.push("/signin")
            })
            .catch((err) => {
                setValues({ ...values, buttonText: "TRY AGAIN" })
                toast.error(err.response.data.error)

            });
    };

    const ForgotPasswordForm = () => (
        <form className={classes.form} noValidate>

            <TextField
                onChange={handleInputChange("newPassword")}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
                autoComplete="new-password"
            />
            <TextField
                onChange={handleInputChange("confirmNewPassword")}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confirmNewPassword"
                label="Confirm Password"
                type="password"
                id="confirmNewPassword"
                autoComplete="confirm-password"
            />
            <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={siginSubmit}
            >
                {buttonText}
            </Button>

        </form>
    );

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <ToastContainer />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Reset Password
        </Typography>
                {ForgotPasswordForm()}
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}
