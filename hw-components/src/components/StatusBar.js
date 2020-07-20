import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  button: {
    marginTop: 10,
    marginRight: 10,
  },
  actionsContainer: {
    marginBottom: 10,
  },
  parent: {
    marginTop: 25,
  },
  info: {
    color: "#4dabf5",
    paddingLeft: 20,
    marginTop: 20,
  },
  req: {
    color: "green",
    paddingLeft: 20,
    marginTop: 20,
  },
  reqMessage: {
    color: "green",
    whiteSpace: "break-spaces",
    paddingLeft: 20,
    marginTop: 20,
  },
  error: {
    color: "#f6685e",
    paddingLeft: 20,
    marginTop: 20,
  },
  errorMessage: {
    color: "red",
    whiteSpace: "break-spaces",
    paddingLeft: 20,
    marginTop: 20,
  },

  statusheight: {
    height: "85vh",
    paddingTop: 20,
    overflowY: "auto",
    background: "black",
  },
});

export default function StatusBar(props) {
  const classes = useStyles();

  let { status: statusArr = [] } = props;

  let playgroundMsg = statusArr.map((state, i) => {
    let { req, type, status, message } = state;

    switch (type) {
      case "info":
        return (
          <p className={classes.info} key={message}>
            {statusArr.length - i} - {message}
          </p>
        );

      case "request":
        let classNameHeading =
          status === "error" ? classes.error : classes.info;
        let classNameReq =
          status === "error" ? classes.errorMessage : classes.reqMessage;

        return (
          <div key={message}>
            <span className={classNameHeading}>
              {statusArr.length - i} - {message}
            </span>
            <pre className={classNameReq}>{req}</pre>
          </div>
        );
      default:
        return null;
    }
  });

  return (
    <Container fixed className={classes.parent}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit">
            Playground Status
          </Typography>
        </Toolbar>
      </AppBar>

      <Paper square elevation={1} className={classes.statusheight}>
        {playgroundMsg}
      </Paper>
    </Container>
  );
}
