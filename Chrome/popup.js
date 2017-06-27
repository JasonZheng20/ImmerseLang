function sendMessage(active, lang, word) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var port = chrome.tabs.connect(tabs[0].id);
    port.postMessage(active + ':' + lang + ':' + word);
  });
}

this.onChange = this.onChange.bind(this);
this.isOn = false;

function onChange() {
  this.isOn = !this.isOn;
  const lang = document.querySelector('.lang').value;
  const word = document.querySelector('.word').value;
  if (this.isOn) {
    if (lang != "" && word != "") {
      sendMessage(true, lang, word);
    }
    else {
      if (lang == "") document.querySelector('.lang').placeholder = "Select a language!";
      if (word == "") document.querySelector('.word').placeholder = "Select a word!";
    }
  }
  else {
    sendMessage(false, "", "");
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.onOrOff').addEventListener('change', () => onChange());
});
