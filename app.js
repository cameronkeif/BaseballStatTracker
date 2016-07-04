/*
 * Module dependencies
 */
var express = require('express')
var stylus = require('stylus')
var nib = require('nib')

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

app.listen(3002)