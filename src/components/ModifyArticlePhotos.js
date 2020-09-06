import React, { useContext, useEffect, useState } from 'react'
import { makeStyles, Accordion, AccordionSummary, Typography, AccordionDetails, Card, CardMedia, Fab, CircularProgress, Tooltip } from '@material-ui/core';
import LocalizedStrings from 'react-localization';
import { modifyArticlePhotosStrings } from '../constants/modifyArticlePhotosStrings';
import { LangContext } from '../App';
import { green } from '@material-ui/core/colors';
import { ExpandMoreSharp, CheckSharp, SaveSharp } from '@material-ui/icons';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
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
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    card: {
        width: 400,
        margin: '0.5vw',
        [theme.breakpoints.down('md')]: {
            width: 300
        },
        [theme.breakpoints.down('sm')]: {
            width: 250
        }
    },
    container: {
        display: 'flex',
        width: '100%',
        listStyle: 'none',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding:'0'
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
    }
}));

const strings = new LocalizedStrings(modifyArticlePhotosStrings);
function ModifyArticlePhotos({ article }) {
    const [photos, setPhotos] = useState([]);
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
        if (article && article.media) setPhotos(article.media)
    }, [article]);

    const updateMedia = async () => {
        setSaving(true);
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/article/media/order/${article._id}`, null,
                {
                    withCredentials: true,
                    params: {
                        media: photos
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

    const SortableItem = SortableElement(({ value }) =>
        <li>
            <Card elevation={5} className={classes.card}>
                <CardMedia className={classes.media} image={value} />
            </Card>
        </li>
    );
    const SortableList = SortableContainer(({ items }) =>
        <ul className={classes.container}>
            {
                items.map((value, index) => (
                    <SortableItem key={value} index={index} value={value} />
                ))
            }
        </ul>
    );
    const onSortEnd = ({ oldIndex, newIndex }) => {
        setSuccess(false);
        setPhotos(old => arrayMove(old, oldIndex, newIndex));
    }
    if (article.media)
        return (
            <div >
                <Accordion expanded={open} onChange={(e, expanded) => setOpen(expanded)} className={classes.root}>
                    <AccordionSummary classes={{ content: classes.title }} expandIcon={<ExpandMoreSharp />} >
                        <Typography className={classes.typography}>{strings.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{ flexDirection: 'column' }}>
                        <SortableList axis='xy' items={photos} onSortEnd={onSortEnd} />
                        <div className={classes.buttonContainer}>
                            <Tooltip title={strings.save}>
                                <Fab disabled={saving} aria-label={strings.save} className={buttonClassname}
                                    color="primary" onClick={updateMedia} >
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

export default ModifyArticlePhotos