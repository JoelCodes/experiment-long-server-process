import { observableFromAsyncIterable } from "./utils";
import {delay as qdelay} from "q";
import axios from 'axios';
import { Observable, from } from "rxjs";

const datsRight = ({data}) => data;
export interface StartInput {
  value: 'Good' | 'Bad';
}

function fromAsyncFn<T>(fn:() => Promise<T>):Observable<T>{
  return new Observable(obs => {
    (async() => {
      try {
        const val = await fn();
        obs.next(val);
        obs.complete();  
      } catch(e){
        obs.error(e);
      }
    })();
  })
}
export async function startJob(input:StartInput):Promise<Job>{
  return axios.post('/api/jobs/start', input).then(datsRight);
}

export function startJob$(input:StartInput):Observable<Job>{
  return fromAsyncFn(() => startJob(input));
}

export async function checkJob(id:string):Promise<Job>{
  return axios.get('/api/jobs/' + id + '/check').then(datsRight);
}
export function checkJob$(id:string):Observable<Job>{
  return fromAsyncFn(() => checkJob(id));
}

export async function *checkGenerator(id:string, delayTimeInMs = 250){
  while(true){
    await qdelay(delayTimeInMs);
    const data = await checkJob(id);
    yield data;
    if(data.remaining === 0) break;
  }
}

export function startCheck$(id:string){
  return observableFromAsyncIterable(checkGenerator(id))
}

export async function cancelJob(id:string):Promise<Job>{
  return axios.post('/api/jobs/' + id + '/cancel').then(datsRight);
}

export function cancelJob$(id:string):Observable<Job>{
  return fromAsyncFn(() => cancelJob(id));
}

export async function confirmJob(id:string):Promise<Job>{
  return axios.post('/api/jobs/' + id + '/confirm').then(datsRight);
}
export function confirmJob$(id:string):Observable<Job>{
  return fromAsyncFn(() => confirmJob(id));
}