import React, { useContext, useEffect, useState } from 'react'
import {
    makeStyles, Accordion, AccordionSummary, Typography, AccordionDetails, Fab, CircularProgress,
    Tooltip,
    ListSubheader,
} from '@material-ui/core';
import LocalizedStrings from 'react-localization';
import { modifyArticleBodyStrings } from '../constants/modifyArticleBodyStrings';
import { LangContext } from '../App';
import { green } from '@material-ui/core/colors';
import { ExpandMoreSharp, CheckSharp, SaveSharp } from '@material-ui/icons';
import { Formik, Form } from 'formik';
import MaterialInput from './MaterialInput';
import axios from 'axios';
import clsx from 'clsx';
import Snack from './Snack';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#f5f3ed'
    },
    title: {
        justifyContent: 'center'
    },
    typography: {
        fontWeight: 'bold'
    },
    buttonContainer: {
        width: 'max-content',
        alignSelf: 'flex-end',
        position: 'relative'
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
    container: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    form: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
    },
    formEl: {
        margin: '1vw'
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column'
    }
}));

const strings = new LocalizedStrings(modifyArticleBodyStrings);

const schema = Yup.object().shape({
    al: Yup.object().shape({
        title: Yup.string().required(strings.required),
        body: Yup.string().required(strings.required)
    }),
    en: Yup.object().shape({
        title: Yup.string().required(strings.required),
        body: Yup.string().required(strings.required)
    }),
    it: Yup.object().shape({
        title: Yup.string().required(strings.required),
        body: Yup.string().required(strings.required)
    })
});

function ModifyArticleBody({ article }) {
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [body, setBody] = useState({});
    const [snack, setSnack] = useState({ open: false, message: '', error: false });
    const classes = useStyles();
    const langContext = useContext(LangContext);
    strings.setLanguage(langContext.lang);

    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
    });

    useEffect(() => {
        if (article && article.article) setBody(article.article);
    }, [article])

    const initialValues = {
        al: {
            title: body.al ? body.al.title : '',
            body: body.al ? body.al.body : ''
        },
        en: {
            title: body.en ? body.en.title : '',
            body: body.en ? body.en.body : ''
        },
        it: {
            title: body.it ? body.it.title : '',
            body: body.it ? body.it.body : ''
        }
    }

    const updateBody = async values => {
        setSaving(true);
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/article/body/${article._id}`, values,
                {
                    withCredentials: true
                });
            if (response) {
                setSuccess(true);
                setSaving(false);
            }
        } catch (error) {
            setSnack({ open: true, message: strings.serverErr, error: true });
            setSuccess(false);
            setSaving(false);
        }
    }


    if (article)
        return (
            <div >
                <Accordion className={classes.root}>
                    <AccordionSummary classes={{ content: classes.title }} expandIcon={<ExpandMoreSharp />} >
                        <Typography className={classes.typography}>{strings.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.container}>
                        {body.al && <Formik initialValues={initialValues} validationSchema={schema} onSubmit={updateBody}>
                            {
                                formik => {
                                    return <Form className={classes.formContainer} onChange={() => setSuccess(false)}>
                                        <div className={classes.form}>
                                            <div className={classes.formEl}>
                                                <ListSubheader >{strings.al}</ListSubheader>
                                                <MaterialInput label={strings.tit} name='al.title' />
                                                <MaterialInput multi={true} label={strings.body} name='al.body' />
                                            </div>
                                            <div className={classes.formEl}>
                                                <ListSubheader >{strings.en}</ListSubheader>
                                                <MaterialInput label={strings.tit} name='en.title' />
                                                <MaterialInput multi={true} label={strings.body} name='en.body' />
                                            </div>
                                            <div className={classes.formEl}>
                                                <ListSubheader >{strings.it}</ListSubheader>
                                                <MaterialInput label={strings.tit} name='it.title' />
                                                <MaterialInput multi={true} label={strings.body} name='it.body' />
                                            </div>
                                        </div>
                                        <div className={classes.buttonContainer}>
                                            <Tooltip title={strings.save}>
                                                <Fab disabled={saving} aria-label={strings.save} className={buttonClassname}
                                                    color="primary" type='submit' >
                                                    {success ? <CheckSharp /> : <SaveSharp />}
                                                </Fab>
                                            </Tooltip>
                                            {saving && <CircularProgress size={68} className={classes.fabProgress} />}
                                        </div>
                                    </Form>
                                }
                            }
                        </Formik>}
                    </AccordionDetails>
                </Accordion>
                <Snack open={snack.open} onClose={() => setSnack({ ...snack, open: false })} hasError={snack.error} message={snack.message} />
            </div>
        ); else return null;
}

export default ModifyArticleBody