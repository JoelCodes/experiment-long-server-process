import { observableFromAsyncIterable } from "./utils";
import {delay as qdelay} from "q";
import axios from 'axios';
import { Observable, from } from "rxjs";

const datsRight = ({data}) => data;

export async function startJob():Promise<Job>{
  return axios.post('/api/jobs/start').then(datsRight);
}

export function startJob$():Observable<Job>{
  return from(startJob());
}

export async function checkJob(id:string):Promise<Job>{
  return axios.get('/api/jobs/' + id + '/check').then(datsRight);
}
export function checkJob$(id:string):Observable<Job>{
  return from(checkJob(id));
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
  return from(cancelJob(id));
}

export async function confirmJob(id:string):Promise<Job>{
  return axios.post('/api/jobs/' + id + '/confirm').then(datsRight);
}
export function confirmJob$(id:string):Observable<Job>{
  return from(confirmJob(id));
}