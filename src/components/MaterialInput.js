import React from 'react';
import { Field, getIn } from 'formik';
import { TextField } from '@material-ui/core';


function MaterialInput(props) {
    const { label, name, multi, ...rest } = props;

    return (
        <>
            <Field name={name}>
                {
                    ({ field, form }) => {
                        return <TextField style={{ marginTop: '1vh' }} multiline={multi}
                            rows={multi && 10} variant='outlined' fullWidth
                            error={getIn(form.errors, name) && getIn(form.touched, name)}
                            label={label} id={name} {...rest} {...field}
                            helperText={getIn(form.touched, name) ? getIn(form.errors, name) : null} />
                    }
                }
            </Field>
        </>
    )
}

export default MaterialInput
