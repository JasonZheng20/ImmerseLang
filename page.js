chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(onMessage);
});

function onMessage(active) {
  if (active) {
    console.log('active');
  }
  else {
    console.log('inactive');
  }
}
