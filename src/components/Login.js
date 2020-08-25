import React, { useState, useEffect, useContext } from 'react';
import { makeStyles, FormControl, InputAdornment, TextField, Button } from '@material-ui/core';
import { AccountCircle, Visibility, VisibilityOff } from '@material-ui/icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { UserContext } from '../App';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    form: {
        display: "flex",
        flexDirection: 'column',
        minHeight: '80vh',
        minWidth: '50vw',
        alignItems: 'center',
        justifyContent: 'center'
    },
    passBtn: {
        '&:hover': {
            cursor: 'pointer'
        }
    }
}));

const initialValues = {
    username: '',
    password: ''
};
const validationSchema = Yup.object({
    username: Yup.string().required('Username required'),
    password: Yup.string().required('Password required').min(6, 'Password must be at least 6 characters')
});
function Login() {
    const userContext = useContext(UserContext);
    const onSubmit = async values => {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, values,{withCredentials:true});
    try {
        userContext.dispatch(response.data);
        return <Redirect to='/' />
    } catch (err) {
        console.log('bad login');
    }

};

const classes = useStyles();

const [showPassword, setShowPassword] = useState(false);
const [inputType, setInputType] = useState(showPassword ? 'text' : 'password');
useEffect(() => {
    setInputType(showPassword ? 'text' : 'password');
}, [showPassword]);

return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} id="login">
        <Form className={classes.form} >
            <FormControl >
                <Field name='username'>
                    {({ field, form, meta }) => (
                        <TextField {...field} error={meta.error && meta.touched} helperText={<ErrorMessage name='username' />} name='username'
                            variant='filled' label='username' InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <AccountCircle />
                                    </InputAdornment>
                                )
                            }} />
                    )}
                </Field>
                <br />
                <Field name='password'>
                    {({ field, form, meta }) => (
                        <TextField {...field} type={inputType} error={meta.error && meta.touched} variant='filled' helperText={<ErrorMessage name='password' />} label='password' InputProps={{
                            endAdornment: (
                                <InputAdornment className={classes.passBtn} onClick={() => setShowPassword(old => !old)} position='end'>
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </InputAdornment>
                            )
                        }} />
                    )}
                </Field>
                <br />
            </FormControl>
            <Button variant="contained" color="secondary" type='submit'>Login</Button>
        </Form>
    </Formik>
)
}

export default Login
