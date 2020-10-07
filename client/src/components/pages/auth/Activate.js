import React, { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { Alert } from "antd";
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
import Loader from "react-loader-spinner";
import swal from "@sweetalert/with-react";

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

export default function Activate(props) {
    const classes = useStyles();

    const [values, setValues] = useState({
        username: "",
        userToken: "",
        loading: true,
        error: ""

    });
    const { username, userToken, loading, error } = values;
    let token = props.match.params.token;

    useEffect(() => {
        let { username } = jwt.decode(token);
        console.log("FE", token)
        if (token) {
            setValues({ ...values, username, userToken });
            activateSubmit()
        }
    }, []);


    const showLoader = () => (
        <Loader type="Rings" color="#00BFFF" height={100} width={100} />
    );

    const showErrorAlert = () => (
        <Alert
            message="Error in user activation"
            description="Activation failed, Please sign up."
            type="error"
            showIcon
        />
    );

    const showSuccessAlert = () => (
        swal({
            title: "Email verification",
            text: `Hi ${username} !. Your email has been verified, please login`,
            icon: "success",
            closeOnClickOutside: false,
            closeOnEsc: false,
            buttons: {
                confirm: "Log in",
            },
            content: <div></div>,
        }));

    const activateSubmit = () => {

        axios
            .post(`${process.env.REACT_APP_API}/users/account_activation`, { token })
            .then((res) => {
                console.log("ACCOUNT ACTIVATION SUCCESS", res);
                setValues({ ...values, loading: false, error: "" });
                toast.success(res.data.message);

            })
            .catch((err) => {
                if (err) {
                    console.log("ACCOUNT ACTIVATION ERROR", err.response.data);
                    setValues({ ...values, isActive: false, error: err.response.data.error });
                    toast.error(err.response.data.error);
                }


            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <ToastContainer />
            <>

                { loading && showLoader()}
                {!loading && !error && showSuccessAlert()}
                {!loading && error && showErrorAlert()}
            </>

            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}
