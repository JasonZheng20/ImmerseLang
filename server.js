const express = require('express');
const bodyParser = require('body-parser');
const googleSheets = require('gsa-sheets');

const key = require('./privateSettings.json');

const SPREADSHEET_ID = '1LSxOT38HJy3woI0PvmKrXW1lFg2pbHaCbQB-XseH7Q8';

const app = express();
const jsonParser = bodyParser.json();
const sheet = googleSheets(key.client_email, key.private_key, SPREADSHEET_ID);

app.use(express.static('public'));

async function onGet(req, res) {
  const result = await sheet.getRows();
  const rows = result.rows;
  const fields = rows[0];
  let top = 0;
  let topName;
  let second = 0;
  let secondName;
  let third = 0;
  let thirdName;
  const jsonArray = [];

  for (let i = 1; i < rows.length; i++) {
    const currRow = rows[i];
    if (parseInt(currRow[1]) >= top) {
      third = second;
      thirdName = secondName;
      second = top;
      secondName = topName;
      top = currRow[1];
      topName = currRow[0];
    }
    else if (parseInt(currRow[1]) >= second) {
      third = second;
      thirdName = secondName;
      second = currRow[1];
      secondName = currRow[0];
    }
    else if (parseInt(currRow[1]) >= third) {
      third = currRow[1];
      thirdName = currRow[0];
    }
  }
  const topObject = {
    player: topName,
    score : top
  };
  const secObject = {
    player: secondName,
    score : second
  };
  const thirdObject = {
    player: thirdName,
    score : third
  };
  jsonArray[0] = topObject;
  jsonArray[1] = secObject;
  jsonArray[2] = thirdObject;
  res.json(jsonArray);
}
app.get('/highScores/', onGet);

async function onPost(req, res) {
  const messageBody = req.body; //a map with pairings, i will have name and score
  const result = await sheet.getRows();
  const rows = result.rows;
  const fields = rows[0];
  const rowArray = [];
  for (let i = 0; i < fields.length; i++) {
    for (let key in messageBody) {
      if (key.toLowerCase() == fields[i].toLowerCase()) {
        rowArray.push(messageBody[key]);
      }
    }
  }
  sheet.appendRow(rowArray);
  res.json( { response: 'success'} );
}
app.post('/postScore/', jsonParser, onPost);

// Please don't change this; this is needed to deploy on Heroku.
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Server listening on port ${port}!`);
});
