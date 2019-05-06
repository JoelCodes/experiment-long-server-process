function delay(t = 1000){
  return new Promise(r => setTimeout(r, t));
}
async function *check(){
  let i = 0;
  while(true){
    await delay();
    yield i++;
  }
}

function makeChecker(){
  const gen = check();
  let canceled = false;

  return []
}