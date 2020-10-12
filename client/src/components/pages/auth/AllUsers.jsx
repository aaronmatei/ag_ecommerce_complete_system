import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Tag, Space, Button } from "antd";
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Container } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'start',
        color: theme.palette.text.secondary,
    },
}));



function AllUsers(props) {
    const classes = useStyles();
    const [users, setUsers] = useState([]);

    const data = users



    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API}/users/all_users`)
            .then((res) => {
                let userss = res.data.users;
                setUsers(userss)
                console.log(userss);
            })
            .catch((err) => {
                console.log("Error in fetching users", err.response.data.message);
            });

    }, []);

    const { Column, ColumnGroup } = Table;

    return (
        <Container>
            <h1>This is user info page</h1>
            <Table dataSource={data}>
                <Column title="#" dataIndex="_id" key={`_id`} />
                <ColumnGroup title="Names">
                    <Column title="First Name" dataIndex="firstName" key="firstName" />
                    <Column title="Middle Name" dataIndex="middleName" key="middleName" />
                    <Column title="Last Name" dataIndex="lastName" key="lastName" />
                </ColumnGroup>
                <Column title="Username" dataIndex="username" key="username" />
                <Column title="Email" dataIndex="email" key="email" />
                <Column
                    title="Phone Number"
                    dataIndex="phoneNumber"
                    key="phoneNumber"
                />
                <Column title="Role" dataIndex="role" key="role" />
                <Column
                    title="Phone Number"
                    dataIndex="phoneNumber"
                    key="phoneNumber"
                />
                <Column title="Gender" dataIndex="gender" key="gender" />
                <Column
                    title="Nationality"
                    dataIndex="nationality"
                    key="nationality"
                />
                <Column title="D.O.B" dataIndex="birthDate" key="birthDate" />


                {/* <Column
                    title="Tags"
                    dataIndex="tags"
                    key="tags"
                    render={(tags) => (
                        <>
                            {tags.map((tag) => (
                                <Tag color="blue" key={tag}>
                                    {tag}
                                </Tag>
                            ))}
                        </>
                    )}
                />
                <Column
                    title="Action"
                    key="action"
                    render={(text, record) => (
                        <Space size="middle">
                            <Button onClick={() => props.history.push(`/auth/user/edit_profile/${userId}`)}>Edit</Button>
                            <Button>Delete</Button>
                        </Space>
                    )}
                /> */}
            </Table>
        </Container>
    );
}

export default AllUsers;
