import React, { useContext, useEffect, useState } from 'react'
import {
    makeStyles, Accordion, AccordionSummary, Typography, AccordionDetails, Fab, CircularProgress,
    Tooltip, Chip
} from '@material-ui/core';
import LocalizedStrings from 'react-localization';
import { modifyArticleTagsStrings } from '../constants/modifyArticleTagsStrings';
import { LangContext } from '../App';
import { green } from '@material-ui/core/colors';
import { ExpandMoreSharp, CheckSharp, SaveSharp } from '@material-ui/icons';
import axios from 'axios';
import { Formik, Form, FieldArray, Field, ErrorMessage } from 'formik';
import clsx from 'clsx';
import * as Yup from 'yup';
import Snack from './Snack';
import { tagStrings, tagLangs } from '../constants/tagStrings';


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
    chipContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '45%',
        border: '1px ridge #00000044',
        borderRadius: '5px',
        paddingBottom: '0.5vh',
        '& > *': {
            margin: '0.1vh'
        }
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width:'100%'
    },
    tags: {
        paddingTop: '1vh',
        display: 'flex',
        width: '100%',
        justifyContent: 'space-around'
    }
}));

const strings = new LocalizedStrings(modifyArticleTagsStrings);
let tagsTranslated = new LocalizedStrings(tagLangs);
function ModifyArticleTags({ article }) {
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [snack, setSnack] = useState({ open: false, message: '', error: false });
    const [availableTags, setavailableTags] = useState(tagStrings);
    const classes = useStyles();
    const langContext = useContext(LangContext);
    strings.setLanguage(langContext.lang);
    tagsTranslated.setLanguage(langContext.lang);

    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
    });
    const initialValues = {
        tags: article.tags ? article.tags : []
    }
    const validationSchema = Yup.object({
        tags: Yup.array().min(1, strings.addOne).max(3, strings.addLimit)
    });
    const updateTags = async (form) => {
        setSaving(true);
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/article/tags/${article._id}`, null,
                {
                    withCredentials: true,
                    params: {
                        tags: form.tags
                    }
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

    useEffect(() => {
        if (article.tags) {
            setavailableTags(tagStrings.filter(tag => !article.tags.includes(tag)));
        }
    }, [article.tags])
    const pushTag = (push, tag) => {
        push(tag);
        setavailableTags(availableTags.filter(s => s !== tag));
    }
    const removeTag = (remove, index, tag) => {
        remove(index);
        setavailableTags(old => [...old, tag]);
    }

    if (article)
        return (
            <div >
                <Accordion className={classes.root}>
                    <AccordionSummary classes={{ content: classes.title }} expandIcon={<ExpandMoreSharp />} >
                        <Typography className={classes.typography}>{strings.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails >
                        {article.tags &&
                            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={updateTags} >
                                {
                                    formik => {
                                        return <Form className={classes.container}>
                                            <div>
                                                <FieldArray name='tags'>
                                                    {fieldArrayProps => {
                                                        const { push, remove, form } = fieldArrayProps;
                                                        const { values } = form;
                                                        const { tags } = values;
                                                        return (<div className={classes.tags}>
                                                            <div className={classes.chipContainer} style={{ backgroundColor: '#ff000010' }}>
                                                                <Typography style={{ width: '100%' }} align='center' variant='subtitle1' >{strings.tagAvailable}</Typography>
                                                                {availableTags.map(tag => {
                                                                    return <Chip label={tagsTranslated[tag]} key={tag}
                                                                        clickable onClick={() => pushTag(push, tag)} />
                                                                })}
                                                            </div>
                                                            <div className={classes.chipContainer} style={{ backgroundColor: '#00ff5110' }}>
                                                                <Typography style={{ width: '100%' }} align='center' variant='subtitle1' >{strings.tagChoosen}</Typography>
                                                                {tags.map((tag, index) => {
                                                                    return <Field name={`tags[${index}]`} key={tag}>
                                                                        {props =>
                                                                            <Chip {...props} label={tagsTranslated[tag]}
                                                                                clickable color='primary' onDelete={() => removeTag(remove, index, tag)} />}
                                                                    </Field>
                                                                })}
                                                                <Typography style={{ width: '100%', color: 'red' }} align='center' variant='caption' ><ErrorMessage name='tags' /></Typography>
                                                            </div>
                                                        </div>)
                                                    }}
                                                </FieldArray>
                                            </div>
                                            <br />
                                            <div className={classes.buttonContainer}>
                                                <Tooltip title={strings.save}>
                                                    <Fab disabled={saving} aria-label={strings.save} className={buttonClassname}
                                                        color="primary" type="submit" >
                                                        {success ? <CheckSharp /> : <SaveSharp />}
                                                    </Fab>
                                                </Tooltip>
                                                {saving && <CircularProgress size={68} className={classes.fabProgress} />}
                                            </div>
                                        </Form>
                                    }
                                }
                            </Formik>
                        }
                    </AccordionDetails>
                </Accordion>
                <Snack open={snack.open} onClose={() => setSnack({ ...snack, open: false })} hasError={snack.error} message={snack.message} />
            </div>
        ); else return null;
}

export default ModifyArticleTags