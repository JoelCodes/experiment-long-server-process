import * as React from 'react';
import { useState, useEffect, useDebugValue } from 'react';
import axios from 'axios';
import { Subject, of } from 'rxjs';
import { takeUntil, flatMap, concat } from 'rxjs/operators';
import { confirmJob$, startCheck$, cancelJob$, startJob } from './data';

const cancel$ = new Subject();
const startingToken = {};

function useUpdater(){
  const [job, setJob] = useState<Job|undefined>();
  const [id, setId] = useState<string|object|undefined>();
  useDebugValue(id, (id) => id === startingToken ? 'Starting' : id === undefined ? 'None' : id);
  useEffect(() => {
    if(typeof id === 'object'){
      startJob().then((job) => {
        setJob(job);
        setId(id);
      })
    } else if(typeof id === 'string') {

      const cancelForReal$ = cancel$
        .pipe(flatMap(cancelJob$));
      
      const check$ = startCheck$(id)
        .pipe(
          concat(of(id).pipe(flatMap(confirmJob$))),
          takeUntil(cancel$));
      
      const checkSub = check$.subscribe(setJob)
      const cancelSub = cancelForReal$.subscribe(setJob);

      return () => {
        checkSub.unsubscribe();
        cancelSub.unsubscribe();
      }
    }
  }, [id]);

  async function startThatJob(){
    setId(startingToken);
  }
  function cancel() {
    cancel$.next(id);
  }
  return {
    job,
    startJob:startThatJob,
    cancel
  };
}

export function UpdaterDemo(){
  const {job, startJob, cancel} = useUpdater();
  if(job !== undefined){
    return (<div>
      <h1>Job Id: {job.id}</h1>
      {job.remaining === undefined ? false : <p>Remaining: {job.remaining}</p>}
      <p>{job.cancelled ? 'Cancelled' : job.confirmed ? 'Confirmed' : <button onClick={cancel}>Cancel</button>}</p>
    </div>);
  }
  return <div>
    <button onClick={startJob}>Start Job</button>
  </div>
}