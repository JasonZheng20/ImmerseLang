chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(onMessage);
});

//----------------------------------------------------------------APPEND ONCLICK

var initiate = true;
var currNode1 = "";
this.finish = this.finish.bind(this);

var bubbleDOM = document.createElement('div');
bubbleDOM.setAttribute('class', 'selection_bubble');
document.body.appendChild(bubbleDOM);
document.querySelector('body').addEventListener('click', function (event) {
  if (document.querySelector('.selection_bubble').style.visibility == "visible" && initiate == false) {
    currNode1.classList.remove('highlighted2');
    bubbleDOM.style.visibility = 'hidden';
    initiate = true;
  }
} );

function renderBubble(mouseX, mouseY, selection, language) {
  bubbleDOM.textContent = "Originally: " + selection;
  console.log('language code: ' + language);
  //add language
  //add pronounciation and sound element
  //Sound API: Forvo API
  //even with sound, need to figure out who to trigger it since i get issues with hovering etc.
  mouseY = mouseY - bubbleDOM.offsetHeight;
  bubbleDOM.style.top = mouseY + 'px';
  bubbleDOM.style.left = mouseX + 'px';
  bubbleDOM.style.visibility = 'visible';
  initiate = false;
}

//----------------------------------------------------------------Main functions

async function onMessage(message) {
  const msg = message.split(':');
  const active = msg[0]; //delimit the message by ':'
  if (active) {
    const decks = msg[2];
    const deckArray = decks.split(','); //IT DOESNT GET UPPER CASE WORDS
    console.log(decks);
    document.body.style = "opacity: 0.3";
    for (let i = 0; i < deckArray.length; i ++) {
      doIt(deckArray, i, msg); //dramatically improves runtime, but requires different backend structure for requests
    }
    // const end = await finish();
  }
  else {
    console.log('inactive');
  }
}

async function doIt(deckArray, i, msg) {
  const word = new RegExp('\\b' + deckArray[i] + '\\b', "g"); //make it so if the word is an article like "the", find the word following
  const translationQuery = await fetch('http://localhost:3000/getTranslation/' + encodeURIComponent(msg[1]) + '/' + encodeURIComponent(deckArray[i])); //current functionality for spanish
  const translationJson = await translationQuery.json(); //THE FIX IS MAKE A SERVER WITH HTTPS THATS IT, ALSO CREATE A CATCH ^
  if (Object.values(translationJson) == 'success') {
    const translationFinish = await fetch('http://localhost:3000/finishTranslation/' + encodeURIComponent(deckArray[i]));
    const finishJson = await translationFinish.json();
    const translationTemp = Object.values(finishJson);
    const translation = translationTemp[1]; //obviously this doesnt scale well
    const traverse = await traversePage(document.querySelector('body'), word, msg[1], translation, deckArray[i]);
    if (i == deckArray.length - 1) {
      const endIt = await finish();
    }
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
      const textArr = node.textContent.split(word);
      node.textContent = textArr[0];
      let currNode = node;
      for (let i = 1; i < textArr.length; i++) {
        const newNode1 = document.createElement('span');
        newNode1.textContent = translation;
        insertAfter(newNode1, currNode);
        console.log(newNode1);
        newNode1.addEventListener('mouseenter', function() {
          newNode1.classList.add('highlighted');
        });
        newNode1.addEventListener('mouseleave', function() {
          newNode1.classList.remove('highlighted');
        });
        newNode1.addEventListener('click', function (event) {
          event.stopPropagation();
          if (currNode1 != "" ) currNode1.classList.remove('highlighted2');
          newNode1.classList.add('highlighted2');
          currNode1 = newNode1;
          renderBubble(getOffset(newNode1).left + newNode1.offsetWidth/3, getOffset(newNode1).top - newNode1.offsetHeight/3, literal, language);
        });
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
