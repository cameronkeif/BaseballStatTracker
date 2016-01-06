function findPlayers(playerName)
{
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('players');
    db.each("SELECT * FROM users WHERE username LIKE '%" + playerName + "%';",
        function(err, row)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                console.log(row.name)
            }
        });
}