const {Subject, Observable} = require('rxjs');
const {takeUntil} = require('rxjs/operators');

function delay(t = 1000){
  return new Promise(resolve => setTimeout(resolve, t));
}
async function *gen(){
  let i = 0;
  while(true){
    console.log('Hit');
    await delay();
    yield i++;
    if(i > 5) throw 'Boo';
  }
}
const check$ = new Observable((observer) => {
  let continuing = true;
  (async() => {
    try {
      for await(const item of gen()){
        if(!continuing) return;
        observer.next(item);
      }
      observer.complete();
    } catch(err){
      observer.error(err);
    }
  })()
  return () => {
    continuing = false;
  };
});
const cancel$ = new Subject();

setTimeout(() => {
  cancel$.next(true)
}, 7500);

check$
  .pipe(takeUntil(cancel$))
  .subscribe((val) => {
    console.log('Next', val);
  }, (err) => {
    console.log('Error', err);
  }, () => {
    console.log('Complete');
  });

