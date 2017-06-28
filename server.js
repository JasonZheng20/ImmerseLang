const express = require('express');
const bodyParser = require('body-parser');
const googleSheets = require('gsa-sheets');

const key = require('./privateSettings.json');

const decks_ID = '1OOpswxXVDKaKNFoJQctr5dLArA2kgmTdzThrt5yPlPg';
const translation_ID = '1BTu_5eQWVrL2XRG1im6_5NvAcVPZhLsEdkAcuv9Lx3Y';

const app = express();
const jsonParser = bodyParser.json();
const decks_sheet = googleSheets(key.client_email, key.private_key, decks_ID);
const translation_sheet = googleSheets(key.client_email, key.private_key, translation_ID);
app.use(express.static('public'));

//------------------------------------------------------------------Translations
async function onGet(req, res) {

  res.json(jsonArray);
}
app.get('/highScores/', onGet);

async function initiateTranslation(req, res) {
  const word = req.params.word;
  const lang = req.params.lang;
  const row = '=GOOGLETRANSLATE("' + word + '","en","' + lang + '")';
  console.log(row);
  // const predictions = await fetch('https://maps.googleapis.com/maps/api/place/textsearch/json?input=' + queryRoute + '&language=en&types=(regions)&key=' + key);
  // const predicObj = await predictions.json();
  // res.json(predicObj);
  //get row
  // onGet();
  res.json( { response: 'success'} );
}
app.post('/getTranslation/:lang/:word', jsonParser, initiateTranslation);

//-----------------------------------------------------------------Miscellaneous
// Please don't change this; this is needed to deploy on Heroku.
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Server listening on port ${port}!`);
});
