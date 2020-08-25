import React, { useContext, useState } from 'react';
import { navbarStrings } from '../constants/navbarStrings';
import { langStrings } from '../constants/languageStrings';
import LocalizedStrings from 'react-localization';
import { LangContext, UserContext } from '../App';
import { AppBar, Toolbar, Typography, IconButton,  MenuItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { LanguageSharp, PersonSharp, ExitToApp } from '@material-ui/icons';
import { StyledMenu } from '../materialStyles/styledMenu'



let navStrings = new LocalizedStrings(navbarStrings);

function Navbar() {

    const langContext = useContext(LangContext);
    const userContext = useContext(UserContext);
    const languages = [langStrings.al, langStrings.en, langStrings.it];

    const [langAnchor, setLangAnchor] = useState(null);
    const [profileAnchor, setProfileAnchor] = useState(null);


    navStrings.setLanguage(langContext.lang);

    const openLangPopUp = (e) => {
        setLangAnchor(e.currentTarget);
    }
    const closeLangPopUp = (lang) => {
        switch (lang) {
            case langStrings.al:
                langContext.dispatch('al');
                break;
            case langStrings.en:
                langContext.dispatch('en');
                break;
            case langStrings.it:
                langContext.dispatch('it');
                break;
            default:
                break;
        }
        setLangAnchor(null);
    }
    const openProfilePopUp = e => {
        setProfileAnchor(e.currentTarget);
    }
    const closeProfilePopUp = () => {
        setProfileAnchor(null);
    }


    return (
        <div>
            <AppBar position="relative" elevation={2}>
                <Toolbar style={{ display: "flex", justifyContent: 'space-between' }}>
                    <div>
                        <Typography>{navStrings.hi} {userContext.user.name.toUpperCase()}</Typography>
                    </div>
                    <div>
                        <IconButton style={{ color: '#ffdfbd' }} aria-controls="navbar-lang-menu"
                            aria-haspopup="true"
                            onClick={openLangPopUp} >
                            <LanguageSharp fontSize='large' />
                        </IconButton>
                        <StyledMenu id='navbar-lang-menu' anchorEl={langAnchor} keepMounted open={Boolean(langAnchor)} onClose={closeLangPopUp} >
                            {
                                languages.map(lang => <MenuItem key={lang}>
                                    <ListItemText onClick={() => closeLangPopUp(lang)} primary={lang}></ListItemText>
                                </MenuItem>)
                            }
                        </StyledMenu>
                        <IconButton style={{ color: 'white' }} aria-controls="navbar-profile-menu"
                            aria-haspopup="true"
                            onClick={openProfilePopUp}>
                            <PersonSharp fontSize='large' />
                        </IconButton>
                        <StyledMenu id='navbar-profile-menu' anchorEl={profileAnchor} keepMounted open={Boolean(profileAnchor)} onClose={closeProfilePopUp} >
                            <MenuItem onClick={closeProfilePopUp}>
                                <ListItemIcon>
                                    <ExitToApp />
                                </ListItemIcon>
                                <Typography variant="inherit">{navStrings.logout}</Typography>
                            </MenuItem>
                        </StyledMenu>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar
