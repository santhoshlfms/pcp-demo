import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default function Error(props ) {

    return ( <> <h1>Hellooooo -  { props.obj.open + ' ss'} </h1>
<Snackbar
anchorOrigin={{
  vertical: 'top',
  horizontal: 'left',
}}
open={props.obj.open}
autoHideDuration={6000}
onClose={props.handleClose}
message="Error Occurred. Check Playground Status"
action={
  <React.Fragment>
    <IconButton size="small" aria-label="close" color="inherit" onClick={props.handleClose} >
      <CloseIcon fontSize="small" />
    </IconButton>
  </React.Fragment>
}
/></>
    )
}