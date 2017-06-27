chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(onMessage);
});

function onMessage(message) {
  const msg = message.split(':');
  const active = msg[0]; //delimit the message by ':'
  if (active) {
    console.log('active');
    console.log(msg[1]); //gets the language
    console.log(msg[2]); //gets the word
  }
  else {
    console.log('inactive');
  }
}

function traversePage() {

}

function isIsolatedText(node) {

}

function replaceText(node) {
  
}
