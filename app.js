/*
 * Module dependencies
 */
var express = require('express')
var stylus = require('stylus')
var nib = require('nib')
var xray = require('x-ray');
var logger = require('morgan');

var app = express()

function compile(str, path) 
{
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(logger('combined'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
));
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.render('index',
  { title : 'Home' }
  )
});

/* Fetches all matching players from the Database
 * Matching is defined as any part of the name containing that string. aka "John" 
 * would return "John Smith" and "Jim Johnson"
 */
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

/* Gets all the COUNTING stats for the player.
 * We want the counting stats so the true averages over multiple seasons can be calculated.
 */
app.get('/getPlayerData', function(request, response) {
  var Xray = require('x-ray');
  var xray = Xray();
  var i;
  var returnArray = [];
  var statsObject = {};
  var numberOfCells = 22;
  var year;
  var cellNumber;
  var playerId = request.query.playerId;
  var url = 'http://www.fangraphs.com/statss.aspx?playerid=' + playerId;
  var fangraphsTabledataSelector = '#SeasonStats1_dgSeason1_ctl00 tbody';
  var mlbSeasonRowSelector = ['tr:not([class*=" grid"]) td'];

  xray(url, fangraphsTabledataSelector, mlbSeasonRowSelector)(function(err, data) {
    for (i = 0; i < data.length; i++) {
      cellNumber = i % numberOfCells;
      switch(cellNumber)
      {
        case 2:
          statsObject['Games Played'] = data[i];
          break;

        case 3:
          statsObject['At Bats'] = data[i];
          break;

        case 4:
          statsObject['Plate Apperances'] = data[i];
          break;

        case 5:
          statsObject['Hits'] = data[i];
          break;

        case 9:
          statsObject['Home Runs'] = data[i];
          break;

        case 10:
          statsObject['Runs'] = data[i];
          break;

        case 11:
          statsObject['RBIs'] = data[i];
          break;

        case 12:
          statsObject['Walks'] = data[i];
          break;

        case 14:
          statsObject['Strikeouts'] = data[i];
          break;

        case 19:
          statsObject['Steals'] = data[i];
          break;

        // End of the row, put the data into the return object
        case numberOfCells - 1:
          returnArray.push(statsObject);
          statsObject = {};
          break;
      }
    }

    response.send(JSON.stringify(returnArray));
  })
});

app.listen(3002);