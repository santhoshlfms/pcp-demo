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
    width: 800,
    marginBottom: 10,
  },
  parent: {
    marginTop: 25,
  },
  info: {
    color: "#4dabf5",
    paddingLeft: 20,
  },
  req: {
    color: "green",
    paddingLeft: 20,
  },
  reqMessage: {
    color: "green",
    whiteSpace: "break-spaces",
    paddingLeft: 20,
  },
  error: {
    color: "#f6685e",
    paddingLeft: 20,
  },
  errorMessage: {
    color: "red",
    whiteSpace: "break-spaces",
    paddingLeft: 20,
  },

  statusheight: {
    height: "85vh",
    overflowY: "auto",
    background: "black",
  },
});

export default function StatusBar(props) {
  const classes = useStyles();

  console.log("rendering status bar");
  let { status } = props;

  let playgroundMsg = status.map((state) => {
    let { req, type, status, message } = state;

    switch (type) {
      case "info":
        return <p className={classes.info}>{message}</p>;

      case "request":
        let classNameHeading =
          status === "error" ? classes.error : classes.info;
        let classNameReq =
          status === "error" ? classes.errorMessage : classes.reqMessage;

        return (
          <>
            <span className={classNameHeading}>{message}</span>
            <pre className={classNameReq}>{req}</pre>
          </>
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
