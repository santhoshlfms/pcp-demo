import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  backdrop: {
    zIndex: 10001,
    color: '#fff',
  },
})

export default function Loader(props) {
  const classes = useStyles();

  return (
    <div>
      <Backdrop className={classes.backdrop} open={props.open} >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
