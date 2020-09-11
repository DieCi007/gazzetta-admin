import React, { useState, useContext, useEffect } from 'react';
import LocalizedStrings from 'react-localization';
import {
    makeStyles, AppBar, Tabs, Tab, Card, CardHeader, Snackbar, SnackbarContent,
    CardMedia, Menu, MenuItem, ListItemIcon, Typography, CardActionArea, Button
} from '@material-ui/core';
import { myArticlesStrings } from '../constants/myArticlesStrings';
import { LangContext } from '../App';
import { a11yProps, getNotPublished, getAllArticles, deleteArticleDB } from '../utils/myArticlesUtils';
import { Pagination } from '@material-ui/lab'
import { Create, Delete } from '@material-ui/icons';
import ConfirmAlert from './ConfirmAlert';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        [theme.breakpoints.down('xs')]: {
            minHeight: '50vh',
        }
    },
    appBar: {
        width: 'fit-content',
        marginBottom: '2vh'
    },
    pagination: {
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column'
        }
    },
    articles: {
        display: 'flex',
        flex: '2',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
    },
    title: {
        height: '50px',
        fontSize: '1.2rem',
        overflow: 'hidden',
        [theme.breakpoints.down('sm')]: {
            fontSize: '1rem'
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '0.9rem'
        }
    },
    card: {
        width: 300,
        height: 'min-content',
        backgroundColor: '#EEEEEE',
        marginBottom: '1vh',
        [theme.breakpoints.down('sm')]: {
            width: 220
        },
        [theme.breakpoints.down('xs')]: {
            width: 150
        }
    },
    media: {
        height: '0',
        paddingTop: '56.25%'
    }
}));

const strings = new LocalizedStrings(myArticlesStrings);

function MyArticles() {
    const classes = useStyles();
    const langContext = useContext(LangContext);
    strings.setLanguage(langContext.lang);
    const [tabValue, setTabValue] = useState(0);
    const [alertOpen, setAlertOpen] = useState(false);
    const [allArticlePage, setAllArticlePage] = useState(1);
    const [notPublishedPage, setNotPublishedPage] = useState(1);
    const [limit, setLimit] = useState(window.innerWidth < 600 ? 6 : 18);
    const [paginatorAnchor, setPaginatorAnchor] = useState(null)
    const [allArticleCount, setAllArticleCount] = useState(1);
    const [snack, setSnack] = useState({ open: false, message: '', error: false });
    const [notPublishedCount, setNotPublishedCount] = useState(1);
    const [allArticles, setAllArticles] = useState([]);
    const [notPublished, setNotPublished] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const response = await getAllArticles(allArticlePage, limit);
            if (response) {
                setAllArticles(response.results);
                setAllArticleCount(response.pages);
            }
        }
        fetchData();
    }, [allArticlePage, limit]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getNotPublished(notPublishedPage, limit);
            if (response) {
                setNotPublished(response.results);
                setNotPublishedCount(response.pages);
            }
        }
        fetchData();
    }, [notPublishedPage, limit]);

    const handleOptionsClick = (e, article) => {
        setAnchorEl(e.currentTarget.firstChild);
        setSelectedArticle(article);
    }
    const deleteArticle = async () => {
        setAnchorEl(null);
        const response = await deleteArticleDB(selectedArticle._id);
        if (!response) setSnack({ error: true, open: true, message: strings.somethingWentWrong });
        else {
            setSnack({ error: false, open: true, message: strings.deleteSuccess });
            setAllArticles(allArticles.filter(a => a._id !== selectedArticle._id));
            setNotPublished(notPublished.filter(a => a._id !== selectedArticle._id));
        }
    }

    return (
        <div className={classes.root}>
            <AppBar position='static' className={classes.appBar}>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} aria-label='tabs'>
                    <Tab label={strings.allArticles} {...a11yProps(0)} />
                    <Tab label={strings.notPublished} {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <div className={classes.articles}>
                {(tabValue === 0 ? allArticles : notPublished).map((article, i) => {
                    const translated = new LocalizedStrings(article.article);
                    translated.setLanguage(langContext.lang)
                    return (
                        <Card key={article._id} className={classes.card}>
                            <CardActionArea aria-controls={`menu${i}`} onClick={(e) => handleOptionsClick(e, article)}>
                                <CardHeader classes={{ title: classes.title }}
                                    title={translated.title}
                                    subheader={new Date(article.date).toLocaleDateString()}
                                />
                                <CardMedia className={classes.media}
                                    image={article.media[0]}
                                />
                                <div style={{ height: '10px', backgroundColor: article.published ? 'green' : 'red' }} />
                            </CardActionArea>
                            <Menu elevation={1} id={`menu${i}`} anchorEl={anchorEl}
                                keepMounted open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                                <MenuItem component={Link} to={{ pathname: '/edit', state: { article: selectedArticle } }} onClick={() => setAnchorEl(null)} >
                                    <ListItemIcon><Create fontSize='small' /></ListItemIcon>
                                    <Typography variant='inherit'>{strings.modify}</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => setAlertOpen(true)}>
                                    <ListItemIcon style={{ color: 'red' }}><Delete fontSize='small' /></ListItemIcon>
                                    <Typography variant='inherit'>{strings.delete}</Typography>
                                </MenuItem>
                            </Menu>
                        </Card>
                    )
                })}
            </div>
            <div className={classes.pagination}>
                <Pagination hidden={tabValue === 1}
                    count={allArticleCount} color='secondary' onChange={(e, v) => { setAllArticlePage(v); window.scrollTo({ top: 0 }) }} />
                <Pagination hidden={tabValue === 0}
                    count={notPublishedCount} color='secondary' onChange={(e, v) => { setNotPublishedPage(v); window.scrollTo({ top: 0 }) }} />
                <div>
                    <span>{strings.itemsPerPage}</span>
                    <Button color='secondary' aria-controls='homePaginatorMenu' aria-haspopup='true'
                        onClick={(e) => setPaginatorAnchor(e.currentTarget)}>{limit}</Button>
                    <Menu id='homePaginatorMenu' anchorEl={paginatorAnchor} open={Boolean(paginatorAnchor)}
                        onClick={() => setPaginatorAnchor(null)}>
                        {
                            [6, 18, 36].map(number => {
                                return (
                                    <MenuItem key={number} onClick={() => {
                                        setLimit(number);
                                        setAllArticlePage(1);
                                        setNotPublishedPage(1);
                                    }} >{number}</MenuItem>
                                )
                            })
                        }
                    </Menu>
                </div>
            </div>
            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })} >
                <SnackbarContent message={snack.message} style={{ backgroundColor: `${snack.error ? 'red' : 'green'}` }} />
            </Snackbar>
            <ConfirmAlert open={alertOpen} onClose={() => setAlertOpen(false)}
                message={<>{strings.deleteAlertMessage0} <b>{strings.modify}</b> {strings.deleteAlertMessage1} <b>{strings.notPublic}</b></>}
                confirm={() => { deleteArticle(); setAlertOpen(false); }} />
        </div>
    )
}

export default MyArticles
