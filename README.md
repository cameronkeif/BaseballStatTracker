This is a tool designed to show how a MLB player's current season stacks up to his history. By looking at stats in this way we can see if a player is getting lucky, or if he may be having a breakout season.

Typically the two most used benchmarks are a player's career numbers, and his numbers for the past three years. This application allows you to select a player and see his stats for these benchmarks, as well as this year.

Right now the application only supports hitters. The reason for this is because pitching stats tend to be a lot more variable and difficult to draw conclusions from. This is something I'm looking to add in the future.

This web application is not being hosted anywhere right now, but I'll likely throw it up on AWS at some point.

Setup instructions:

1. Install node.js
2. Install npm
3. Install MongoDB
4. Run ```npm install``` to install all node dependencies
5. Execute the scripts in db_scripts to populate the database (this contains the player information so we can look up their stats)