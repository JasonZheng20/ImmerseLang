chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(onMessage);
});

function onMessage(active) {
  if (active) {
    document.body.style = "opacity: 0.5";
    document.querySelector('body').addEventListener('click', this.respond);
    document.querySelector('body').addEventListener('mouseover', this.hover);
  }
  else {
    document.body.style = "opacity: 1";
    document.querySelector('body').removeEventListener('click', this.respond);
    document.querySelector('body').removeEventListener('mouseover', this.hover);
    $('#dialog').hide();
    if (this.hovering != "") this.hovering.style = "outline:0px";
    if (this.chosenTarget != "") this.chosenTarget.style = "outline:0px";
  }
}
