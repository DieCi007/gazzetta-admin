import React from 'react'
import { Snackbar,SnackbarContent } from '@material-ui/core'

function Snack({open, onClose, message, hasError}) {
    return (
        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={open} autoHideDuration={3000} onClose={onClose} >
            <SnackbarContent message={message} style={{ backgroundColor: `${hasError ? 'red' : 'green'}` }} />
        </Snackbar>
    )
}

export default Snack
