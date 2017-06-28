chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(onMessage);
});

async function onMessage(message) {
  const msg = message.split(':');
  const active = msg[0]; //delimit the message by ':'
  console.log(msg[1]);
  console.log(msg[2]);
  if (active) {
    this.word = new RegExp('\\b' + msg[2] + '\\b', "g"); //make it so if the word is an article like "the", find the word following
    const translationQuery = await fetch('http://localhost:3000/getTranslation/' + encodeURIComponent(msg[1]) + '/' + encodeURIComponent(msg[2])); //current functionality for spanish
    const translationJson = await translationQuery.json(); //THE FIX IS MAKE A SERVER WITH HTTPS THATS IT ^
    this.translation = Object.values(translationJson);
    traversePage(document.querySelector('body'));
  }
  else {
    console.log('inactive');
  }
}

function traversePage(node) {
  if (node.nodeType == Node.TEXT_NODE) {
    if (node.textContent.match(this.word)) {
      node.textContent = node.textContent.replace(this.word, this.translation);
    }
  }
  for (const child of node.childNodes) {
    traversePage(child);
  }
}
