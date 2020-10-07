import React, { useState } from 'react';
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import {
    makeStyles,
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
    Container
} from '@material-ui/core'

import { LockOutlined } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function SignUp() {
    const [values, setValues] = useState({
        username: "",
        firstName: "",
        middleName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirm_password: "",
        error: "",
        buttonText: "Submit"
    })

    const { username, firstName, middleName, lastName, phoneNumber, email, password, confirm_password, buttonText } = values


    const handleInputChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value })

    }
    const clickSubmit = (event) => {
        event.preventDefault()
        setValues({ ...values, buttonText: "Loading.." })
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/users/signup`,
            data: { username, firstName, middleName, lastName, phoneNumber, email, password, confirm_password }
        })
            .then(res => {
                console.log('SIGN UP SUCCESS', res)
                setValues({ ...values, username: "", firstName: "", middleName: "", lastName: "", phoneNumber: "", email: "", password: "", confirm_password: "", buttonText: "Submitted" })
                toast.success(res.data.message)
            })
            .catch(err => {
                console.log('SIGN UP ERROR', err.response.data)
                setValues({ ...values, buttonText: 'Submit' })
                toast.error(err.response.data.message)
            })

    }

    const signUpForm = () => (
        <form className={classes.form} noValidate>
            <TextField
                onChange={handleInputChange('username')}
                value={username}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
            />
            <TextField
                onChange={handleInputChange('firstName')}
                value={firstName}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="First Name"
                autoFocus
            />
            <TextField
                onChange={handleInputChange('middleName')}
                value={middleName}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="middleName"
                label="Middle Name"
                name="middleName"
                autoComplete="Middle Name"
                autoFocus
            />
            <TextField
                onChange={handleInputChange('lastName')}
                value={lastName}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="Last Name"
                autoFocus
            />
            <TextField
                onChange={handleInputChange('phoneNumber')}
                value={phoneNumber}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="phoneNumber"
                label="Phone Number"
                name="phoneNumber"
                autoComplete="Phone Number"
                autoFocus
            />

            <TextField
                onChange={handleInputChange('email')}
                value={email}
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


            <TextField
                onChange={handleInputChange('password')}
                value={password}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
            />

            <TextField
                onChange={handleInputChange('confirm_password')}
                value={confirm_password}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confirm_password"
                label="Confirm Password"
                type="password"
                id="confirm_password"
                autoComplete="confirm-password"
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={clickSubmit}
            >
                {buttonText}
            </Button>
            <Grid container>
                <Grid item>
                    <Link href="/signin" variant="body2">
                        {"Already have an account? Sign In"}
                    </Link>
                </Grid>
            </Grid>
        </form>
    )

    const classes = useStyles();
    return (

        <Container component="main" maxWidth="xs">

            <CssBaseline />
            <ToastContainer />
            {JSON.stringify({
                username,
                firstName,
                middleName,
                lastName,
                phoneNumber,
                email,
                password,
                confirm_password
            })}
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign Up
        </Typography>
                {signUpForm()}
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}