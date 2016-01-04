function logIn(username, password)
{
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('beer');
    db.get("SELECT * FROM users WHERE username ='" + username +"' AND password = '" + password +"';",
        function(err, count)
        {
            if(err)
            {
                console.log(err);
            }
            else if (count > 1)
            {
                i = 1;
                // stub, this should navigate to user's dashboard.
            }
        });
}

function t(A)
{
    console.log(A);
}
logIn("admin", "camiscool");