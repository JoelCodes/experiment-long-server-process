import { Observable } from "rxjs";

export function observableFromAsyncIterable<T>(gen:AsyncIterable<T>):Observable<T>{
  return new Observable(observer => {
    let running = true;
    (async () => {
      try {
        for await(const item of gen){
          if(!running) return;
          observer.next(item);
        }
        observer.complete();
      } catch(e){
        observer.error(e);
      }
    })();
    return () => {
      running = false;
    }
  })
}

export function observableFromAsyncGenerator<T, TArgs>(gen):Observable<T>{
  return (...args:any[]) => {
    return observableFromAsyncIterable<T>(gen(...args));
  }
}
