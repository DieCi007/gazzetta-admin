import React from 'react'
import MaterialInput from './MaterialInput';

function FormikControl(props) {
    const { control, ...rest } = props;
    switch (control) {
        case 'input': return <MaterialInput {...rest} />
        default: return null;
    }
}

export default FormikControl
