chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(onMessage);
});

async function onMessage(message) {
  const msg = message.split(':');
  const active = msg[0]; //delimit the message by ':'
  console.log(active);
  if (active) {
    console.log('active');
    console.log('language: ' + msg[1]); //gets the language
    console.log('word: ' + msg[2]);
    this.word = new RegExp('\\b' + msg[2] + '\\b', "g"); //make it so if the word is an article like "the", find the word following
    // console.log('https://localhost:3000/getTranslation/es/' + encodeURIComponent(msg[2] + '/'));
    const translationQuery = await fetch('localhost:3000/getTranslation/es/' + encodeURIComponent(msg[2] + '/')); //current functionality for spanish
    this.translation = await translationQuery.json(); //THE FIX IS MAKE A SERVER WITH HTTPS THATS IT ^
    console.log(translationQuery);

    traversePage(document.querySelector('body'));
  }
  else {
    console.log('inactive');
  }
}

function traversePage(node) {
  if (node.nodeType == Node.TEXT_NODE) {
    if (node.textContent.match(this.word)) {
      node.textContent = node.textContent.replace(this.word, "REPLACEMENT STRING");
    }
  }
  for (const child of node.childNodes) {
    traversePage(child);
  }
}
