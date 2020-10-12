import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage, Form } from "formik";
import {
    Button,
    Container,
    Toast,
    ProgressBar,
    Breadcrumb,
} from "react-bootstrap";
import { toast, Slide, ToastContainer } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";

// form validation useing Yup
const validate = () =>
    Yup.object({
        userName: Yup.string().min(2, "Must be more then 2 characters"),
        firstName: Yup.string().min(2, "Must be more than 2 characters"),
        middleName: Yup.string().min(2, "Must be more then 2 characters"),
        lastName: Yup.string().min(2, "Must be more than 2 characters"),
        email: Yup.string()
            .email("Please enter a vaild email")
            .min(2, "Must be more than 2 characters"),
        phoneNumber: Yup.number()
            .positive("Must be more than 0")
            .integer("Must be more than 0"),
        password: Yup.string().min(8, "Must be more than 8 characters").nullable(),
        verifyPassword: Yup.string()
            .min(8, "Must be more than 8 characters")
            .nullable(),
        gender: Yup.string().min(2, "Must be more than 2 characters").nullable(),
        nationality: Yup.string()
            .min(2, "Must be more than 2 characters")
            .nullable(),
        birthDate: Yup.date().nullable(),
    });

function EditProfileForm(props) {
    // const { user, loading } = useSelector(state => state.userrr);

    // const dispatch = useDispatch();

    const [user, setUser] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    let id = props.match.params.id;

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API}/users/user_info/${id}`)
            .then((res) => {
                console.log("UPDATED USER", res.data.user)
                setUser(res.data.user);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.response.data.message);
            });
    }, []);

    // handle submit our form
    const handleSubmitt = (userToUpdate) => {
        axios
            .put(`${process.env.REACT_APP_API}/users/edit_user/${id}`, userToUpdate)
            .then((res) => {
                console.log("USER TO UPDATE SUCCESS", userToUpdate);
                toast.success(res.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    transition: Slide,
                });
                props.history.push(`/auth/user/user_info/${id}`);
            })
            .catch((err) => {
                console.log("ERROR UPDATING USER", err.response.data.error);
                toast.error(err.response.data.error, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: false,
                });
            });
    };

    let initialValues;
    if (user) {
        initialValues = {
            password: "",
            userName: user.username,
            verifyPassword: "",
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName,
            email: user.email,
            gender: user.gender,
            nationality: user.nationality,
            birthDate: user.birthDate,
            phoneNumber: user.phoneNumber,
        };
    }

    return (
        <Container>
            <ToastContainer />
            {loading && <ProgressBar animated now={100} />}

            {user && (
                <>
                    <Breadcrumb>
                        <Breadcrumb.Item onClick={() => props.history.push(`/auth/user/user_info/${user._id}`)}>
                            My Profile
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Edit account</Breadcrumb.Item>
                    </Breadcrumb>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validate}
                        onSubmit={(values, { setSubmitting }) => {
                            const updatedUser = {
                                password: values.password,
                                username: values.username,
                                verifyPassword: values.verifyPassword,
                                firstName: values.firstName,
                                lastName: values.lastName,
                                middleName: values.middleName,
                                email: values.email,
                                gender: values.gender,
                                nationality: values.nationality,
                                birthDate: values.birthDate,
                                phoneNumber: values.phoneNumber,
                            };

                            handleSubmitt(updatedUser);

                            setSubmitting(false);
                        }}
                    >
                        <Form
                            action={`${process.env.REACT_APP_API}/users/edit_user/${user.id}`}
                            method="put"
                            className="edit-profile-form mb-5"
                        >
                            <div className="form-group">
                                <label>Username *</label>
                                <Field
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    placeholder={user.username}
                                />
                                <ErrorMessage component={Toast} name="username" />
                            </div>
                            <div className="form-group">
                                <label>First Name *</label>
                                <Field
                                    type="text"
                                    name="firstName"
                                    className="form-control"
                                    placeholder={user.firstName}
                                />
                                <ErrorMessage component={Toast} name="firstName" />
                            </div>
                            <div className="form-group">
                                <label>Middle Name *</label>
                                <Field
                                    type="text"
                                    name="middleName"
                                    className="form-control"
                                    placeholder={user.middleName}
                                />
                                <ErrorMessage component={Toast} name="middleName" />
                            </div>
                            <div className="form-group">
                                <label>Last Name *</label>
                                <Field
                                    type="text"
                                    name="lastName"
                                    className="form-control"
                                    placeholder={user.lastName}
                                />
                                <ErrorMessage component={Toast} name="lastName" />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <Field
                                    type="text"
                                    name="email"
                                    className="form-control"
                                    placeholder={user.email}
                                />
                                <ErrorMessage component={Toast} name="email" />
                            </div>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <Field
                                    type="text"
                                    name="phoneNumber"
                                    className="form-control"
                                    placeholder={user.phoneNumber}
                                />
                                <ErrorMessage component={Toast} name="phoneNumber" />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <Field
                                    as="select"
                                    type="text"
                                    name="gender"
                                    className="form-control"

                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </Field>
                                <ErrorMessage component={Toast} name="gender" />
                            </div>
                            <div className="form-group">
                                <label>Nationality</label>
                                <Field
                                    type="text"
                                    name="nationality"
                                    className="form-control"
                                    placeholder={user.nationality}
                                />
                                <ErrorMessage component={Toast} name="nationality" />
                            </div>
                            <div className="form-group">
                                <label>Birth Date</label>
                                <Field
                                    type="date"
                                    name="birthDate"
                                    className="form-control"
                                />
                                <ErrorMessage component={Toast} name="birthDate" />
                            </div>
                            <div className="form-group">
                                <label>Password *</label>
                                <Field
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Enter new password"
                                />
                                <ErrorMessage component={Toast} name="password" />
                            </div>
                            <div className="form-group">
                                <label>Verify Password *</label>
                                <Field
                                    type="password"
                                    name="verifyPassword"
                                    className="form-control"
                                    placeholder="Enter password again"
                                />
                                <ErrorMessage component={Toast} name="verifyPassword" />
                            </div>
                            <Button variant="primary" type="submit">
                                UPDATE{" "}
                            </Button>{" "}
                        </Form>
                    </Formik>
                </>
            )
            }
        </Container >
    );
}

export default EditProfileForm;
