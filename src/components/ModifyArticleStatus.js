import React, { useContext, useEffect, useState } from 'react'
import {
    makeStyles, Accordion, AccordionSummary, Typography, AccordionDetails, Fab, CircularProgress,
    Tooltip, FormGroup, FormControlLabel, Checkbox
} from '@material-ui/core';
import LocalizedStrings from 'react-localization';
import { modifyArticleStatusStrings } from '../constants/modifyArticleStatusStrings';
import { LangContext } from '../App';
import { green } from '@material-ui/core/colors';
import { ExpandMoreSharp, CheckSharp, SaveSharp } from '@material-ui/icons';
import axios from 'axios';
import clsx from 'clsx';
import Snack from './Snack';


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
    }
}));

const strings = new LocalizedStrings(modifyArticleStatusStrings);
function ModifyArticleStatus({ article }) {
    const [published, setPublished] = useState(false);
    const [mainPage, setMainPage] = useState(false);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [snack, setSnack] = useState({ open: false, message: '', error: false });
    const classes = useStyles();
    const langContext = useContext(LangContext);
    strings.setLanguage(langContext.lang);

    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
    });

    useEffect(() => {
        if (article) {
            setPublished(article.published);
            setMainPage(article.mainPage);
        }
    }, [article]);

    const updateStatus = async () => {
        setSaving(true);
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/article/status/${article._id}`, null,
                {
                    withCredentials: true,
                    params: {
                        published: published,
                        mainPage: mainPage
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


    if (article)
        return (
            <div >
                <Accordion expanded={open} onChange={(e, expanded) => setOpen(expanded)} className={classes.root}>
                    <AccordionSummary classes={{ content: classes.title }} expandIcon={<ExpandMoreSharp />} >
                        <Typography className={classes.typography}>{strings.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.container}>
                        <FormGroup row={false}>
                            <FormControlLabel control={<Checkbox checked={published || false} onChange={(e) => {
                                setPublished(e.currentTarget.checked);
                                setSuccess(false);
                            }} />} label={strings.notPublished} />
                            <FormControlLabel control={<Checkbox checked={mainPage || false} onChange={(e) => {
                                setMainPage(e.currentTarget.checked);
                                setSuccess(false);
                            }} />} label={strings.mainPage} />
                        </FormGroup>
                        <div className={classes.buttonContainer}>
                            <Tooltip title={strings.save}>
                                <Fab disabled={saving} aria-label={strings.save} className={buttonClassname}
                                    color="primary" onClick={updateStatus} >
                                    {success ? <CheckSharp /> : <SaveSharp />}
                                </Fab>
                            </Tooltip>
                            {saving && <CircularProgress size={68} className={classes.fabProgress} />}
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Snack open={snack.open} onClose={() => setSnack({ ...snack, open: false })} hasError={snack.error} message={snack.message} />
            </div>
        ); else return null;
}

export default ModifyArticleStatus