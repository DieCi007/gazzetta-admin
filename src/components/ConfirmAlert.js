import React, { useContext } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import LocalizedStrings from 'react-localization';
import { confirmPassAlertStrings } from '../constants/confirmPassAlertStrings';
import { LangContext } from '../App';

const strings = new LocalizedStrings(confirmPassAlertStrings);

function ConfirmAlert({ open, onClose, confirm, message0, message1, bold }) {
    const langContext = useContext(LangContext);
    strings.setLanguage(langContext.lang);

    return (
        <>
            <Dialog open={open} onClose={onClose} aria-labelledby='confirmAlert' >
                <DialogTitle id='confrimAlert'>{strings.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {message0} <b>{bold}</b> {message1}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        {strings.cancel}
                    </Button>
                    <Button onClick={confirm} style={{ color: 'red' }}>
                        {strings.confirm}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ConfirmAlert
