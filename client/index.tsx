import * as React from 'react';
import {render} from 'react-dom';
import { useState, useRef } from 'react';
import axios from 'axios';
import {Subject} from 'rxjs';
import { delay } from 'q';

const cancel$ = new Subject()
function UpdaterDemo(){
  const [job, setJob] = useState();
  const [remaining, setRemaining] = useState<number|undefined>(undefined);

  async function startJob(){
    const {data} = await axios.post('/api/jobs/start')
    setJob(data);
    while(true){
      const {data:{remaining}} = await axios.get('/api/jobs/' + data + '/check');
      setRemaining(remaining);
      if(remaining === 0) break;
      await delay(250);
    }
    await axios.post('/api/jobs/' + data + '/confirm');
  } 
  if(job){
    return (<div>
      <h1>Job Id: {job}</h1>
      {remaining === undefined ? false : <p>Remaining: {remaining}</p>}
      <p><button onClick={cancel$.next}>Cancel</button></p>
    </div>);
  }
  return <div>
    <button onClick={startJob}>Start Job</button>
  </div>
}

render(<UpdaterDemo/>, document.getElementById('react-root'));