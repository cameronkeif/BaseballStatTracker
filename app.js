/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')


var app = express()

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.post('/findPlayers', function(req, res) {
    var playerName = "";
    req.on('data', function (data) {
            playerName += data;
        });
    console.log("Name:" + req.body);
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('baseball.db');
    db.each("SELECT * FROM players WHERE name LIKE '%" + "Cab" + "%';",
        function(err, row)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                //console.log(row.NAME)
            }
        });
});

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
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