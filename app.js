/*
 * Module dependencies
 */
var express = require('express')
var stylus = require('stylus')
var nib = require('nib')
var xray = require('x-ray');

var logger = require('morgan');

var app = express()

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.get('/findPlayers', function(request, response) {
  var playerName = request.query.playerName;
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database('baseball.db');
  var matchingPlayers = "";
  db.each("SELECT * FROM players WHERE name LIKE '%" + playerName + "%';",
    function(err, row)
    {
      if(err)
      {
        console.log(err);
      }
      else
      {
        matchingPlayers += '<li id="' + row.ID + '">' + row.NAME + ' - ' + row.TEAM + '</li>';
      }
    },
    function(err, rows) 
    {
      response.send(matchingPlayers);
    });
});

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(logger())
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.render('index',
  { title : 'Home' }
  )
})

app.get('/test', function(request, response) {
  var Xray = require('x-ray');
  var xray = Xray();
  var i;
  var returnObject = {};
  var statsObject = {};
  var numberOfCells = 21;
  var year;
  var cellNumber;
  var games;

  xray('http://www.fangraphs.com/statss.aspx?playerid=12916', '#SeasonStats1_dgSeason11_ctl00 tbody', ["tr:not([class*=\" grid\"]) td"])(function(err, data) {
    for (i = 0; i < data.length; i++) {
      cellNumber = i % numberOfCells;
      switch(cellNumber)
      {
        // Year
        case 0:
          year = data[i];
          break;

        // Number of games
        case 2:
          games = data[i];
          statsObject['Games'] = games;
          break;

        // End of the row, put the data into the return object
        case numberOfCells - 1:
          returnObject[year] = statsObject;
          statsObject = {};
          break;
      }
      
      /*
        var Games = Number(parsedRow[3].outerText);
        var Homeruns = Number(parsedRow[5].outerText);
        var Runs = Number(parsedRow[6].outerText);
        var RBIs = Number(parsedRow[7].outerText);
        var Steals = Number(parsedRow[8].outerText);
        var WalkRate = Number(parsedRow[9].outerText.replace("%", ""));
        var StrikeOutRate = Number(parsedRow[10].outerText.replace("%", ""));
        var IsolatedPower = Number(parsedRow[11].outerText);
        var BABIP = Number(parsedRow[12].outerText);
        var BattingAverage = Number(parsedRow[13].outerText);
        var OnBasePercentage = Number(parsedRow[14].outerText);
        var SluggingPercentage = Number(parsedRow[15].outerText);
      */
    }


    response.send(JSON.stringify(returnObject));
  })
});

app.listen(3002);