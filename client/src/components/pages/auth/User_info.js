import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProgressBar, Container } from "react-bootstrap"
import { Table, Tag, Space, Button } from "antd";
import { makeStyles } from "@material-ui/core/styles";
import { ToastContainer } from "react-toastify";
import { Grid, Paper, LinearProgress } from "@material-ui/core";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: "start",
        color: theme.palette.text.primary,

    },
}));

function User_info(props) {
    const classes = useStyles();
    function FormRow(propss) {
        return (
            <React.Fragment>
                <Grid item xs={4} justify="flex-start">
                    <Paper className={classes.paper} style={{ fontWeight: "bolder" }}>{propss.keyy}</Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper} style={{ fontStyle: "italic" }}>{propss.value}</Paper>
                </Grid>
            </React.Fragment>
        );
    }

    const userId = props.match.params.id;

    const [values, setValues] = useState({
        loading: true,
        userId: "",
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        middleName: "",
        phoneNumber: "",
        role: "",
        isActive: "",
        tags: ["new", "returning"],
        gender: "",
        nationality: "",
        birthDate: "",
    });

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API}/users/user_info/${userId}`)
            .then((res) => {
                let user = res.data.user;
                setValues({
                    ...values,
                    userId: user._id,
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    middleName: user.middleName,
                    lastName: user.lastName,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                    isActive: user.isActive,
                    gender: user.gender,
                    nationality: user.nationality,
                    birthDate: user.birthDate,
                    loading: false
                });
                console.log(res.data.user);
            })
            .catch((err) => {
                console.log("Error in getting user", err.response.data.message);
            });
    }, []);

    const { Column, ColumnGroup } = Table;

    return (
        <Container>
            <ToastContainer />
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly", width: "50%", alignItems: "baseline" }}>
                <h2>This is your user profile </h2>{" "}
                <Button
                    onClick={() =>
                        props.history.push(`/auth/user/edit_profile/${userId}`)
                    }
                >
                    Edit profile
                </Button>
            </div>

            {values.loading && <LinearProgress />}



            <Grid container spacing={1}>
                <Grid container item xs={12} spacing={3}>
                    <FormRow keyy={`Username`} value={values.username} />
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <FormRow keyy={`First Name`} value={values.firstName} />
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <FormRow keyy={`Middle Name`} value={values.middleName} />
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <FormRow keyy={`Last Name`} value={values.lastName} />
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <FormRow keyy={`Email`} value={values.email} />
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <FormRow keyy={`Phone Number`} value={values.phoneNumber} />
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <FormRow keyy={`Role`} value={values.role} />
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <FormRow keyy={`Gender`} value={values.gender} />
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <FormRow keyy={`Nationality`} value={values.nationality} />
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <FormRow
                        keyy={`DOB`}
                        value={moment(values.birthDate).format("DD-MM-YYYY")}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}

export default User_info;
