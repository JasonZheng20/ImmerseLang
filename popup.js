function sendMessage(active) {
  if (active == true) {
    document.querySelector('.start').classList.add('inactive');
    document.querySelector('.end').classList.remove('inactive');
  }
  else {
    document.querySelector('.end').classList.add('inactive');
    document.querySelector('.start').classList.remove('inactive');
  }
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var port = chrome.tabs.connect(tabs[0].id);
    port.postMessage(active);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const button = document.querySelector('.start');
  button.addEventListener(
    'click', () => sendMessage(true) );
  document.querySelector('.end').addEventListener(
    'click', () => sendMessage(false) );
});
