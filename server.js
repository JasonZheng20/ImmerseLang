const express = require('express');
const bodyParser = require('body-parser');
const googleSheets = require('gsa-sheets');

const key = require('./privateSettings.json');

const SPREADSHEET_ID = '1LSxOT38HJy3woI0PvmKrXW1lFg2pbHaCbQB-XseH7Q8'; //create a new spreadsheet for translations

const app = express();
const jsonParser = bodyParser.json();
const sheet = googleSheets(key.client_email, key.private_key, SPREADSHEET_ID);
app.use(express.static('public'));

//------------------------------------------------------------------Translations
async function onGet(req, res) {

  res.json(jsonArray);
}
app.get('/highScores/', onGet);

async function onPost(req, res) {
  res.json( { response: 'success'} );
}
app.post('/postScore/', jsonParser, onPost);

//-----------------------------------------------------------------Miscellaneous
// Please don't change this; this is needed to deploy on Heroku.
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Server listening on port ${port}!`);
});
