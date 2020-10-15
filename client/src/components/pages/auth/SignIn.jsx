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
import { authenticate } from "./helpers";
import GoogleSignIn from "./Google"
import FacebookLogin from "./Facebook"

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

export default function SignIn(props) {
  const classes = useStyles();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const { email, password } = values;

  const handleInputChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const informParent = res => {
    // authenticate user
    authenticate(res, () => {
      setValues({
        ...values,
        email: "",
        password: "",
        buttonText: "LOGGED IN",
      });
      toast.success(
        `Hi ${res.data.user.username} !, You are now signed in. Welcome`
      );
      props.history.push("/");
    });

  }



  const siginSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, buttonText: "Loading.." });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/users/signin`,
      data: { email, password },
    })
      .then((res) => {
        console.log("SIGN IN SUCCESS", res);
        // save response to localstorage or cookie
        // authenticate user
        authenticate(res, () => {
          setValues({
            ...values,
            email: "",
            password: "",
            buttonText: "LOGGED IN",
          });
          toast.success(
            `Hi ${res.data.user.username} !, You are now signed in. Welcome`
          );
          props.history.push("/");
        });
      })
      .then()
      .catch((err) => {
        console.log("SIGN IN ERROR", err.response.data);
        setValues({ ...values, buttonText: "Login" });
        toast.error(err.response.data.error);
      });
  };

  const signInForm = () => (
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
      <TextField
        onChange={handleInputChange("password")}
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
        Sign In
      </Button>
      <Grid container spacing={2}>
        <Grid item xs><GoogleSignIn informParent={informParent} /></Grid>
        <Grid item xs><FacebookLogin informParent={informParent} /></Grid>
      </Grid>
      <Grid container>
        <Grid item xs>
          Forgot password? {" "}
          <Link href="/auth/user/forgot_password" variant="body2">
            Reset
          </Link>
        </Grid>
        <Grid item>
          <Link href="/signup" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </Grid>
      </Grid>
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
        {signInForm()}
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
