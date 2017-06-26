function sendMessage(active) {
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
    'click', () => sendMessage(false, button) );
});
