const letters = 'abcdefghijklmnopqrstuvwxyz';
const alphabet = letters.toUpperCase() + letters.toLowerCase() + '0123456789';

function makeRandomId(length = 10, last = ''){
  if(length <= 0){
    return last;
  }
  const currentLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
  return makeRandomId(length - 1, last + currentLetter);
}

module.exports = {
  makeRandomId
};