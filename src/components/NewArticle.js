import React, { useContext, useState } from 'react';
import { Typography, makeStyles, Tabs, Tab, Paper, Button, Chip } from '@material-ui/core';
import { newArticleStrings } from '../constants/newArticleStrings';
import LocalizedStrings from 'react-localization';
import PropTypes from 'prop-types';
import { LangContext } from '../App';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MaterialInput from './MaterialInput';
import { tagStrings, tagLangs } from '../constants/tagStrings';

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
    const langContext = useContext(LangContext);
    const classes = useStyles();
    const [tab, setTab] = useState(0);
    const [tags, setTags] = useState(tagStrings);
    const [selectedTags, setSelectedTags] = useState([]);
    strings.setLanguage(langContext.lang);
    tagsTranslated.setLanguage(langContext.lang);

    function TabPanel(props) {
        const { children, value, index, ...other } = props;
        return (
            <div
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
            </div>
        )
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };

    const initialValues = {
        article: {
            al: {
                title: '',
                body: ''
            },
            en: {
                title: '',
                body: ''
            },
            it: {
                title: '',
                body: ''
            },
        }
    }

    const validationSchema = Yup.object().shape({
        article: Yup.object().shape({
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
        })
    })

    const onSubmit = values => {
        console.log(values);
    }

    const changeTab = (event, newValue) => {
        setTab(newValue);
    };

    const addTag = tag => {
        if (selectedTags.length < 3) {
            setTags(tags.filter(s => s !== tag));
            setSelectedTags(old => [...old, tag]);
        }
    }

    const removeTag = tag => {
        setSelectedTags(selectedTags.filter(s => s !== tag));
        setTags(old => [...old, tag]);
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
                                <Tabs
                                    value={tab}
                                    onChange={changeTab}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    variant="fullWidth"
                                    aria-label="tabs" >
                                    <Tab label={strings.albanian} {...a11yProps(0)} />
                                    <Tab label={strings.english} {...a11yProps(1)} />
                                    <Tab label={strings.italian} {...a11yProps(2)} />
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
                            <div className={classes.tags}>
                                <div className={classes.chipContainer} style={{ backgroundColor: '#ff000010' }}>
                                    <Typography style={{ width: '100%' }} align='center' variant='subtitle1' >{strings.tagAvailable}</Typography>
                                    {
                                        tags.map(tag => {
                                            return <Chip label={tagsTranslated[tag]} key={tag}
                                                clickable onClick={() => addTag(tag)} />
                                        })
                                    }
                                </div>
                                <div className={classes.chipContainer} style={{ backgroundColor: '#00ff5110' }}>
                                    <Typography style={{ width: '100%' }} align='center' variant='subtitle1' >{strings.tagChoosen}</Typography>
                                    {
                                        selectedTags.map(tag => {
                                            return <Chip label={tagsTranslated[tag]} key={tag}
                                                clickable color='primary' onDelete={() => removeTag(tag)} />
                                        })
                                    }
                                </div>
                            </div>
                            <div>
                                <br />
                                <Button variant='contained' color='secondary' type='submit' >{strings.publish}</Button>
                            </div>
                        </Form>
                    }
                }
            </Formik>


        </div>
    )
}

export default NewArticle
