import * as React from 'react';
import { useState, useEffect, useDebugValue } from 'react';
import { Subject, of } from 'rxjs';
import { takeUntil, flatMap, concat } from 'rxjs/operators';
import { confirmJob$, startCheck$, cancelJob$, startJob, StartInput, startJob$ } from './data';

const startingToken = {};

function useUpdater(){
  const [job, setJob] = useState<Job|undefined>();
  const [id, setId] = useState<string|object|undefined>();
  const [message, setMessage] = useState<string|undefined>();
  useDebugValue(id, (id) => id === startingToken ? 'Starting' : id === undefined ? 'None' : id);
  useEffect(() => {
    if(typeof id === 'string') {

      const check$ = startCheck$(id)
        .pipe(concat(confirmJob$(id)));
      
      const checkSub = check$.subscribe(setJob)

      return () => {
        checkSub.unsubscribe();
      }
    }
  }, [id]);

  async function startThatJob(input:StartInput){
    startJob$(input)
      .subscribe((job) => {
        if(job.good){
          setJob(job);
          setId(job.id);
        } else {
          setMessage("That was a bad job");
        }
      })
  }
  function clearMessage(){
    setMessage(undefined);
  }
  return {
    job,
    startThatJob,
    message,
    clearMessage,
  };
}

export function UpdaterDemo(){
  const {job, startThatJob, clearMessage, message} = useUpdater();
  if(job !== undefined){
    return (<div>
      <h1>Job Id: {job.id}</h1>
      {job.remaining === undefined ? false : <p>Remaining: {job.remaining}</p>}
      <p>{job.cancelled ? 'Cancelled' : job.confirmed ? 'Confirmed' : 'Running'}</p>
      {message && <p>{message} <button onClick={clearMessage}>&times;</button></p>}
    </div>);
  }
  return <div>
    <button onClick={() => startThatJob({value: 'Good'})}>Start Good Job</button>&nbsp;
    <button onClick={() => startThatJob({value: "Bad"})}>Start Bad Job</button>
    {message && <p>{message} <button onClick={clearMessage}>&times;</button></p>}
  </div>
}