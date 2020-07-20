import React, {  useEffect, useReducer, useCallback } from "react";
import Grid from "@material-ui/core/Grid";


import StepperContainer from "./components/StepperContainer";
import StatusBar from "./components/StatusBar";

const reducer = (state, action) => {
  if(!action) return [];
  return [ ...action, ...state];

};

export default function App() {
  let [status, setStatus] = useReducer(reducer, []);

  const resetStatus = useCallback(() => {
    setStatus(null)
  },[setStatus])

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
        <StepperContainer updateStatus={setStatus} resetStatus={resetStatus}/>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <StatusBar status={status} />
      </Grid>
    </Grid>
  );
}
