import React, { useContext, useEffect, useState } from 'react'
import { makeStyles, Accordion, AccordionSummary, Typography, AccordionDetails, Card, CardMedia, Fab, CircularProgress, Tooltip } from '@material-ui/core';
import LocalizedStrings from 'react-localization';
import { modifyArticlePhotosStrings } from '../constants/modifyArticlePhotosStrings';
import { LangContext } from '../App';
import { green } from '@material-ui/core/colors';
import { ExpandMoreSharp, CheckSharp, SaveSharp, DeleteSharp } from '@material-ui/icons';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import axios from 'axios';
import clsx from 'clsx';
import Snack from './Snack';
import ConfirmAlert from './ConfirmAlert';


const useStyles = makeStyles((theme) => ({
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
        padding: '0'
    },
    buttonContainer: {
        width: 'max-content',
        position: 'relative',
        marginLeft: '1vw',
        display: 'flex',
        flexWrap: 'wrap'
    },
    buttonGroup: {
        display: 'flex',
        flexDirection: 'row-reverse',
        flexWrap: 'wrap'
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
    delPhoto: {
        height: `${1080 / 25}px`,
        width: `${1920 / 25}px`,
        borderRadius: '5px',
        marginRight: '0.5vw',
        cursor: 'pointer'
    }
}));

const strings = new LocalizedStrings(modifyArticlePhotosStrings);
function ModifyArticlePhotos({ article }) {
    const [photos, setPhotos] = useState([]);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [deleteList, setDeleteList] = useState([]);
    const [deletingState, setDeletingState] = useState(false);
    const [snack, setSnack] = useState({ open: false, message: '', error: false });
    const classes = useStyles();
    const langContext = useContext(LangContext);
    strings.setLanguage(langContext.lang);

    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
    });
    const deleteButtonClassname = clsx({
        [classes.buttonSuccess]: deleteSuccess,
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
    const handleDeleteBtn = () => {
        if (!deletingState) setDeletingState(true);
        else if (deleteList.length === 0) setDeletingState(false);
        else setAlertOpen(true);
    }
    const deleteMedia = async () => {
        setSaving(true);
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/article/media/delete/${article._id}`, {
                withCredentials: true,
                params: {
                    media: deleteList
                }
            });
            if (response) {
                setPhotos(response.data.message.media);
                setDeleteSuccess(true);
                setSaving(false);
                setAlertOpen(false);
                setDeleteList([]);
                setDeletingState(false);
                setTimeout(() => {
                    setDeleteSuccess(false);
                }, 2000);
            }
        } catch (error) {
            setSnack({ open: true, message: strings.serverErr, error: true });
            setDeleteSuccess(false);
            setSaving(false);
        }
    }
    const handlePhotoClick = value => {
        if (!deletingState) return;
        if ((deleteList.length + 1) >= photos.length) return;
        if (deleteList.indexOf(value) === -1)
            setDeleteList(old => [...old, value]);
    }
    const hanldeDelPhotoClick = photo => {
        let newPhotoArray = deleteList.filter(i => i !== photo);
        setDeleteList(newPhotoArray);
    }
    const disableDeletingState = () => {
        setDeletingState(false);
        setDeleteList([]);
        setAlertOpen(false);
    }
    const SortableItem = SortableElement(({ value }) =>
        <li onClick={() => handlePhotoClick(value)}>
            <Card elevation={5} className={classes.card} style={{ cursor: clsx({ pointer: deletingState }) }} >
                <CardMedia className={classes.media} image={value} />
            </Card>
        </li>
    );
    const SortableList = SortableContainer(({ items }) =>
        <ul className={classes.container} >
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
                <Accordion expanded={open} onChange={(e, expanded) => setOpen(expanded)}
                    style={{ backgroundColor: clsx({ '#f5f3ed': !deletingState }, { '#f003': deletingState }) }}>
                    <AccordionSummary classes={{ content: classes.title }} expandIcon={<ExpandMoreSharp />} >
                        <Typography className={classes.typography}>{strings.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{ flexDirection: 'column' }}>
                        <SortableList shouldCancelStart={() => deletingState} pressDelay={200} axis='xy' items={photos} onSortEnd={onSortEnd} />
                        <div className={classes.buttonGroup}>
                            <div className={classes.buttonContainer}>
                                <Tooltip title={strings.save}>
                                    <Fab disabled={saving} aria-label={strings.save} className={buttonClassname}
                                        color="primary" onClick={updateMedia} >
                                        {success ? <CheckSharp /> : <SaveSharp />}
                                    </Fab>
                                </Tooltip>
                                {saving && <CircularProgress size={68} className={classes.fabProgress} />}
                            </div>
                            <div style={{ display: 'flex' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                    {
                                        deleteList.map(photo => (
                                            <img key={photo} src={photo} alt="Article" className={classes.delPhoto}
                                                onClick={() => hanldeDelPhotoClick(photo)} />
                                        ))
                                    }
                                </div>
                                <div className={classes.buttonContainer}>
                                    <Tooltip title={strings.delete}>
                                        <Fab disabled={saving} aria-label={strings.delete} className={deleteButtonClassname}
                                            color="secondary" onClick={() => handleDeleteBtn()} >
                                            {deleteSuccess ? <CheckSharp /> : <DeleteSharp />}
                                        </Fab>
                                    </Tooltip>
                                    {saving && <CircularProgress size={68} className={classes.fabProgress} />}
                                </div>
                            </div>
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Snack open={snack.open} onClose={() => setSnack({ ...snack, open: false })} hasError={snack.error} message={snack.message} />
                <ConfirmAlert open={alertOpen} onClose={() => disableDeletingState()}
                    message={strings.alertMsg} confirm={() => deleteMedia()} />
            </div>
        ); else return null;
}

export default ModifyArticlePhotos