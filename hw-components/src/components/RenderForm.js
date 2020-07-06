import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import { TextValidator } from "react-material-ui-form-validator";

import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles({
  helperText: {
    marginBottom: 5,
  },
});

export default function RenderForm(props) {
  const classes = useStyles();
  let { formElem, handleFieldChange, handleBlur, fields } = props;

  return formElem.map((elem, i) => {
    let renderElem;
    switch (elem.type) {
      case "text":
      case "password":
        renderElem = (
          <FormControl fullWidth margin="dense">
            <TextValidator
              type={elem.type}
              label={elem.label}
              ref={elem.ref}
              disabled={elem.disabled}
              onChange={handleFieldChange}
              onBlur={handleBlur(elem.ref)}
              name={elem.name}
              id={elem.name}
              value={fields[elem.id]}
              validators={elem.validators}
              errorMessages={elem.errorMessages}
            />

            <FormHelperText id="my-helper-text" className={classes.helperText}>
              {`${elem.helperText} *`}
            </FormHelperText>
          </FormControl>
        );

        break;

      case "date":
        renderElem = (
          <FormControl fullWidth margin="dense">
            <TextValidator
              type={elem.type}
              ref={elem.ref}
              onChange={handleFieldChange}
              onBlur={handleBlur(elem.ref)}
              name={elem.name}
              id={elem.name}
              value={fields[elem.id]}
              validators={elem.validators}
              errorMessages={elem.errorMessages}
            />

            <FormHelperText id="my-helper-text" className={classes.helperText}>
              {`${elem.helperText} *`}
            </FormHelperText>
          </FormControl>
        );

        break;

      case "select":
        renderElem = (
          <FormControl fullWidth margin="dense">
            <TextValidator
              select
              ref={elem.ref}
              onChange={handleFieldChange}
              name={elem.name}
              disabled={elem.disabled}
              id={elem.name}
              value={fields[elem.id]}
              validators={elem.validators}
              errorMessages={elem.errorMessages}
              SelectProps={{
                native: true,
              }}
            >
              {Object.keys(elem.entries).map((option) => (
                <option key={elem.entries[option]} value={elem.entries[option]}>
                  {option}
                </option>
              ))}
            </TextValidator>

            <FormHelperText id="my-helper-text" className={classes.helperText}>
              {`${elem.helperText} *`}
            </FormHelperText>
          </FormControl>
        );

        break;

      default:
        renderElem = null;
        break;
    }
    return renderElem;
  });
}
