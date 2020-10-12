import React, { useState } from "react";
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Link,
    Box,
    Typography,
    makeStyles,
    Container,
} from "@material-ui/core";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { LockOutlined } from "@material-ui/icons";


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

export default function ForgotPassword(props) {
    const classes = useStyles();

    const [values, setValues] = useState({
        email: "",
        buttonText: "Request reset link",
    });
    const { email, buttonText } = values;

    const handleInputChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });
    };

    const forgotPasswordSubmit = (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: "Submiting..." });
        axios({
            method: "PUT",
            url: `${process.env.REACT_APP_API}/users/forgot_password`,
            data: { email },
        })
            .then((res) => {
                console.log("EMAIL SENT TO RESET PASSWORD", res.data.message)
                setValues({ ...values, buttonText: "link sent" })
                toast.success(res.data.message)
                props.history.push("/signin")

            })
            .catch((err) => {
                let errormessage = err.response.data.error
                console.log("ERROR IN SENDING RESET PASSWORD EMAIL", errormessage)
                toast.error(errormessage)
                setValues({ ...values, buttonText: "Request again" })

            });
    };

    const ForgotPasswordForm = () => (
        <form className={classes.form} noValidate>
            <TextField
                onChange={handleInputChange("email")}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
            />


            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={forgotPasswordSubmit}
            >
                Reset Password
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
                    Sign in
        </Typography>
                {ForgotPasswordForm()}
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}
