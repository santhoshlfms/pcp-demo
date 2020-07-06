import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  backdrop: {
    zIndex: 10001,
    color: "#fff",
  },
  msg: {
    textTransform: "uppercase",
    padding: 2,
  },
});

export default function Loader(props) {
  const classes = useStyles();
  const { obj } = props;

  return (
    <div>
      <Backdrop className={classes.backdrop} open={obj.open}>
        <Typography className={classes.msg}>{obj.message}</Typography>
        <CircularProgress color="primary" />
      </Backdrop>
    </div>
  );
}
