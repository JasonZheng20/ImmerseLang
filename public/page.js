chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(onMessage);
});

//------------------------------------------------------TEST WITH APPEND ONCLICK

var bubbleDOM = document.createElement('div');
bubbleDOM.setAttribute('class', 'selection_bubble');
document.body.appendChild(bubbleDOM);

// Move that bubble to the appropriate location.
function renderBubble(mouseX, mouseY, selection) {
  // bubbleDOM.innerHTML = selection;
  bubbleDOM.textContent = "Originally: " + selection;
  mouseY = mouseY - bubbleDOM.offsetHeight;
  bubbleDOM.style.top = mouseY + 'px';
  bubbleDOM.style.left = mouseX + 'px';
  bubbleDOM.style.visibility = 'visible';
}

//------------------------------------------------------------------------------

this.onHover = this.onHover.bind(this);
this.offHover = this.offHover.bind(this);

async function onMessage(message) {
  const msg = message.split(':');
  const active = msg[0]; //delimit the message by ':'
  if (active) {
    const word = new RegExp('\\b' + msg[2] + '\\b', "g"); //make it so if the word is an article like "the", find the word following
    document.body.style = "opacity: 0.3";
    const translationQuery = await fetch('http://localhost:3000/getTranslation/' + encodeURIComponent(msg[1]) + '/' + encodeURIComponent(msg[2])); //current functionality for spanish
    const translationJson = await translationQuery.json(); //THE FIX IS MAKE A SERVER WITH HTTPS THATS IT, ALSO CREATE A CATCH ^
    if (Object.values(translationJson) == 'success') {
      const translationFinish = await fetch('http://localhost:3000/finishTranslation/' + encodeURIComponent(msg[2]));
      const finishJson = await translationFinish.json();
      const translationTemp = Object.values(finishJson);
      const translation = translationTemp[1]; //obviously this doesnt scale well
      const traverse = await traversePage(document.querySelector('body'), word, msg[1], translation, msg[2]);
      const doneLoading = await finish();
    }
  }
  else {
    console.log('inactive'); //for some reason this is treated as the catch?
  }
}

function finish() {
  document.body.style = "opacity: 1";
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function getOffset(el) {
  el = el.getBoundingClientRect();
  return {
    left: el.left + window.scrollX,
    top: el.top + window.scrollY
  }
}

function traversePage(node, word, language, translation, literal) {
  if (node.nodeType == Node.TEXT_NODE) {
    if (node.textContent.match(word)) {
      const textArr = node.textContent.split(word); //not sure if this works yet, SOMETIMES THIS GETS SUBSTRING ARGH
      node.textContent = textArr[0];
      let currNode = node;
      for (let i = 1; i < textArr.length; i++) {
        const newNode1 = document.createElement('span');
        newNode1.textContent = translation;
        insertAfter(newNode1, currNode);
        console.log(newNode1);
        newNode1.addEventListener('mouseenter', function () { //create a div right there on the z axis
          renderBubble(getOffset(newNode1).left + newNode1.offsetWidth/3, getOffset(newNode1).top - newNode1.offsetHeight/3, literal);
        });
        newNode1.addEventListener('mouseleave', function () {
          bubbleDOM.style.visibility = 'hidden';
        } );
        const newNode2 = document.createElement('span');
        newNode2.textContent = textArr[i];
        insertAfter(newNode2, newNode1);
        currNode = newNode2;
      }
    }
  }
  for (const child of node.childNodes) {
    traversePage(child, word, language, translation, literal);
  }
}

function onHover() {

}

function offHover() {

}
