import React, { useContext, useEffect, useState } from 'react'
import { makeStyles, Accordion, AccordionSummary, Typography, AccordionDetails, Card, CardMedia, Button } from '@material-ui/core';
import LocalizedStrings from 'react-localization';
import { modifyArticlePhotosStrings } from '../constants/modifyArticlePhotosStrings';
import { LangContext } from '../App';
import { ExpandMoreSharp } from '@material-ui/icons';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

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
        margin: '0.5vw'
    },
    container: {
        display: 'flex',
        width: '100%',
        listStyle: 'none',
        justifyContent: 'center',
        flexWrap: 'wrap'
    }
}))
const strings = new LocalizedStrings(modifyArticlePhotosStrings);
function ModifyArticlePhotos({ article }) {
    const [photos, setPhotos] = useState([]);
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const langContext = useContext(LangContext);
    strings.setLanguage(langContext.lang);

    useEffect(() => {
        if (article && article.media) setPhotos(article.media)
    }, [article])

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
                        <Button style={{ width: 'max-content', alignSelf: 'flex-end' }} onClick={() => setOpen(false)} variant='contained' >Click</Button>
                    </AccordionDetails>
                </Accordion>
            </div>
        ); else return null;
}

export default ModifyArticlePhotos