import React, {  useEffect, useReducer } from "react";
import Grid from "@material-ui/core/Grid";


import StepperContainer from "./components/StepperContainer";
import StatusBar from "./components/StatusBar";

const reducer = (state, action) => {
  return [ ...action, ...state];
};

export default function App() {
  let [status, setStatus] = useReducer(reducer, []);

  useEffect(() => {
    window.scrollTo(0,0);
    setStatus([
      {message:'Enter Credentials', type:'info'}
    ])
  
    return () => {
    }
  }, [setStatus])

  
  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <StepperContainer updateStatus={setStatus} />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <StatusBar status={status} />
      </Grid>
    </Grid>
  );
}
