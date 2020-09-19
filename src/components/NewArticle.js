import React, { useContext, useState } from 'react';
import {
    Typography, Snackbar, makeStyles, Tabs, Tab, Paper, Button,
    Chip, FormControlLabel, Checkbox, InputLabel, SnackbarContent, Badge
} from '@material-ui/core';
import { newArticleStrings } from '../constants/newArticleStrings';
import LocalizedStrings from 'react-localization';
import PropTypes from 'prop-types';
import { LangContext } from '../App';
import { Formik, Form, FieldArray, Field, ErrorMessage } from 'formik';
import MaterialInput from './MaterialInput';
import { tagStrings, tagLangs } from '../constants/tagStrings';
import { valSchema, initialValues, postArticle } from '../utils/newArticleUtils';
import * as imageConversion from 'image-conversion';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    tabPanel: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    form: {
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        [theme.breakpoints.down('1150')]: {
            width: '80%'
        },
        [theme.breakpoints.down('650')]: {
            width: '100%'
        }
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
    tags: {
        paddingTop: '1vh',
        display: 'flex',
        width: '100%',
        justifyContent: 'space-around'
    }
}));
let strings = new LocalizedStrings(newArticleStrings);
let tagsTranslated = new LocalizedStrings(tagLangs);
function a11yProps(index) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}
function NewArticle() {
    /**State and context */
    const [checkPublished, setCheckPublished] = useState(false);
    const [checkMainPage, setCheckMainPage] = useState(false);
    const langContext = useContext(LangContext);
    const classes = useStyles();
    const [tab, setTab] = useState(0);
    const [availableTags, setavailableTags] = useState(tagStrings);
    const [snack, setSnack] = useState({ open: false, message: '', error: false });
    const [selectedFiles, setSelectedFiles] = useState(0);
    const [media, setMedia] = useState([]);
    strings.setLanguage(langContext.lang);
    tagsTranslated.setLanguage(langContext.lang);
    const validationSchema = valSchema(strings);

    /**Tab properties*/
    function TabPanel(props) {
        const { children, value, index, ...other } = props;
        return (<div
            className={classes.tabPanel}
            role='tabpanel'
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other} >
            {value === index && (
                <div style={{ width: '100%', paddingTop: '10px' }}>
                    {children}
                </div>
            )}
        </div>)
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };

    /**Event handling*/
    const onSubmit = async (values, props) => {
        const response = await postArticle(values, media);
        if (response) {
            setSnack({ open: true, error: false, message: strings.success });
            props.resetForm();
            setSelectedFiles(0);
            setavailableTags(tagStrings);
        } else {
            setSnack({ open: true, error: true, message: strings.err })
        }
        props.setSubmitting(false);
        setCheckPublished(false);
        setCheckMainPage(false);
    }

    const changeTab = (event, newValue) => {
        setTab(newValue);
    };

    const pushTag = (push, tag) => {
        push(tag);
        setavailableTags(availableTags.filter(s => s !== tag));
    }
    const removeTag = (remove, index, tag) => {
        remove(index);
        setavailableTags(old => [...old, tag]);
    }
    const addMedia = e => {
        let files = e.target.files;
        if (files) setSelectedFiles(files.length)
        let fileArray = [];
        for (let i = 0; i < files.length; i++) {
            imageConversion.compressAccurately(files[i], 200).then(res => {
                fileArray.push(res);
            })
        }
        setMedia(() => fileArray);
    }

    const closeSnack = () => {
        setSnack({
            open: false,
            message: '',
            error: false
        })
    }
    const handleBadge = (form, a, b) => {
        if (form.getFieldMeta(a).touched && form.getFieldMeta(a).error) return '!';
        else if (form.getFieldMeta(b).touched && form.getFieldMeta(b).error) return '!';
        else return 0;
    }

    return (
        <div className={classes.root}>
            <Typography variant='h6' >
                {strings.header}
            </Typography>
            <br />
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {
                    formik => {
                        return <Form className={classes.form}>
                            <Paper>
                                <Tabs value={tab} onChange={changeTab} indicatorColor="primary"
                                    textColor="primary" variant="fullWidth" aria-label="tabs" >
                                    <Tab label={<Badge badgeContent={handleBadge(formik, 'article.al.title', 'article.al.body')} color='error'>
                                        <Typography>{strings.albanian}</Typography>
                                    </Badge>} {...a11yProps(0)} />
                                    <Tab label={<Badge badgeContent={handleBadge(formik, 'article.en.title', 'article.en.body')} color='error'>
                                        <Typography>{strings.english}</Typography>
                                    </Badge>} {...a11yProps(1)} />
                                    <Tab label={<Badge badgeContent={handleBadge(formik, 'article.it.title', 'article.it.body')} color='error'>
                                        <Typography>{strings.italian}</Typography>
                                    </Badge>} {...a11yProps(2)} />
                                </Tabs>
                            </Paper>
                            <TabPanel value={tab} index={0}>
                                <MaterialInput label={strings.title} name='article.al.title' />
                                <MaterialInput multi={true} label={strings.body} name='article.al.body' />
                            </TabPanel>
                            <TabPanel value={tab} index={1}>
                                <MaterialInput label={strings.title} name='article.en.title' />
                                <MaterialInput multi={true} label={strings.body} name='article.en.body' />
                            </TabPanel>
                            <TabPanel value={tab} index={2}>
                                <MaterialInput label={strings.title} name='article.it.title' />
                                <MaterialInput multi={true} label={strings.body} name='article.it.body' />
                            </TabPanel>
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
                            <Field name='published'>
                                {props => <FormControlLabel control={
                                    <Checkbox checked={checkPublished} onChange={() => {
                                        formik.setFieldValue(props.field.name, !props.field.value);
                                        setCheckPublished(old => !old);
                                    }} />} label={strings.noPublish} />}
                            </Field>
                            <Field name='mainPage'>
                                {props => <FormControlLabel control={
                                    <Checkbox checked={checkMainPage} onChange={() => {
                                        formik.setFieldValue(props.field.name, !props.field.value);
                                        setCheckMainPage(old => !old);
                                    }} />} label={strings.mainPage} />}
                            </Field>
                            <input
                                accept="image/*" hidden
                                id="newArticleInputMedia"
                                multiple onChange={e => addMedia(e)}
                                type="file"
                            />
                            <InputLabel htmlFor="newArticleInputMedia">
                                <Button variant='contained' component="span" className={classes.button}> {strings.addMedia}  </Button>
                            </InputLabel>
                            <span>{strings.filesSelected} {selectedFiles}</span>
                            <div>
                                <br /><br />
                                <Button disabled={formik.isSubmitting} variant='contained' color='secondary' type='submit' >{strings.publish}</Button>
                            </div>
                        </Form>
                    }
                }
            </Formik>
            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={snack.open} autoHideDuration={3000} onClose={closeSnack} >
                <SnackbarContent message={snack.message} style={{ backgroundColor: `${snack.error ? 'red' : 'green'}` }} />
            </Snackbar>
        </div>
    )
}
export default NewArticle