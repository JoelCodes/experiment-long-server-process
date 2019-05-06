const express = require('express');
const {makeRandomId} = require('./utils');

const app = express();
const jobs = {};

app.use(express.static('public'));

const jobRouter = new express.Router();

function delay(t = 1000){
  return new Promise(res => setTimeout(res, t));
}
async function runJob(id){
  const job = jobs[id];
  while(job.remaining > 0){
    if(job.cancelled) return;
    await delay();
    job.remaining--;
    console.log('Updating', job);
  }
  job.finished = new Date();
  console.log('Finished', job);
  await delay(5 * 60 * 1000);
  console.log('Checked after a long time', job);
  if(!job.confirmed){
    console.log('Bad News!', job);
    delete jobs[id];
  } else {
    console.log('All Done!', job);
  }

}

jobRouter
  .post('/start', (req, res) => {
    const id = makeRandomId();
    jobs[id] = {
      remaining: Math.floor(Math.random() * 20) + 10,
    };
    runJob(id);
    res.json(id);
  })
  .get('/:id/check', (req, res) => {
    res.json(jobs[req.params.id]);
  })
  .post('/:id/cancel', (req, res) => {
    const job = jobs[req.params.id];
    if(!job){
      res.sendStatus(404);
    } else if(job.confirmed || job.cancelled){
      res.sendStatus(423);      
    } else {
      job.cancelled = true;
      res.json(job);
      console.log('Received Cancellation', job);
    } 
  })
  .post('/:id/confirm', (req, res) => {
    const job = jobs[req.params.id];
    if(job){
      if(!job.confirmed && !job.cancelled){
        job.confirmed = true;
        res.json(job);  
      } else {
        res.sendStatus(423);
      }
    } else {
      res.sendStatus(404);
    }
  });

app.use('/api/jobs', jobRouter);

app.listen(8080, () => {
  console.log('Listening on 8080');
});