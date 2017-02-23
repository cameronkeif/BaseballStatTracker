/* Converts an array into an HTML table row 
 * dataArray: the array to convert.
 * 
 * returns: a string containing a series of cells, one for each member of dataArray
 */
function arrayToTableCells(dataArray) 
{
    return '<td>' + dataArray.join('</td><td>') + '</td>';
}

/* Fills out an array with a default value (basically array.prototype.fill, but works on any browser) 
 * defaultValue:    The value to fill with
 * arrayToPopulate: The array to fill
 * start:           The start index (the first member to be filled)
 * end:             The end index (the last member to be filled)
 */
function populateInitialDataArray(defaultValue, arrayToPopulate, start, end)
{
    for (var i = start; i <= end; i++)
    {
        arrayToPopulate[i] = defaultValue;
    }
}

/* Initializes a row in the stats table.
 * rowSelector:     The CSS selector to get this row.
 * datasetTitle:    The title of the dataset (the left-most column)
 */
function initializeTableRow(rowSelector, datasetTitle)
{
    var rowArray = [datasetTitle];
    var NUMBER_OF_STATS_IN_TABLE = 13;
    populateInitialDataArray(0, rowArray, 1, NUMBER_OF_STATS_IN_TABLE);
    $(rowSelector).append(arrayToTableCells(rowArray));
}

/* Initializes all three data rows with 0s
 */
function initializeData()
{
    clearData();
    initializeTableRow('#careerAverage', 'Career Average');
    initializeTableRow('#threeYearAverage', 'Three Year Average');
    initializeTableRow('#currentYear', 'Current Year');
}

/* Clears all data in the table
 */
function clearData()
{
    $('#careerAverage').empty();
    $('#threeYearAverage').empty();
    $('#currentYear').empty();
}

function decimalRound(value, precision)
{
    var multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
}

/* Calculates a player's batting average.
 * plateAppearances:    number of plate appearances
 * hits:                number of hits
 * 
 * returns: the player's batting average.
 */
function calculateBattingAverage(plateAppearances, hits, precision)
{
    
    return decimalRound((hits / plateAppearances), precision);
}

function generateArrayForTablePopulation(data, label, numberOfSeasons)
{
    var tableDataArray = [];
    var i;
    var totals;
    var stat;
    var RATIO_STAT_PRECISION_DIGITS = 3;

    if (numberOfSeasons > data.length) {
        numberOfSeasons = data.length;
    }

    for (i = data.length - numberOfSeasons; i < data.length; i++) {
        if (totals) {
            for (stat in data[i]) {
                totals[stat] += data[i][stat];
            }
        }
        else {
            totals = data[i];
        }
    }

    console.log(totals);

    tableDataArray[0] = label;
    tableDataArray[1] = totals['Games Played'] / numberOfSeasons;
    tableDataArray[2] = totals['Plate Apperances'] / numberOfSeasons;
    tableDataArray[3] = totals['Home Runs'] / numberOfSeasons;
    tableDataArray[4] = totals['Runs'] / numberOfSeasons;
    tableDataArray[5] = totals['RBIs'] / numberOfSeasons;
    tableDataArray[6] = totals['Steals'] / numberOfSeasons;
    tableDataArray[7] = 0;
    tableDataArray[8] = 0;
    tableDataArray[9] = 0;
    tableDataArray[10] = 0;
    tableDataArray[11] = calculateBattingAverage(totals['Plate Apperances'], totals['Hits'], RATIO_STAT_PRECISION_DIGITS);
    tableDataArray[12] = 0;
    tableDataArray[13] = 0;

    return tableDataArray;
}

function getRecentData(playerId)
{
    clearData();
    $.ajax({
        type: 'GET',
        url: "getPlayerData",
        data: {playerId: playerId},
        success: function(data) {
            data = JSON.parse(data);
            console.log(generateArrayForTablePopulation(data, 'Current Year', 2));
        }
    });
}

$( document ).ready(function() {
    initializeData();
    $("#btnSearch").click(function() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3002/findPlayers?playerName=' + $("#playerSearch").val()
    }).done(function(data){
        $("#matchingPlayers").empty();
        $("#matchingPlayers").append(data);
        $('#matchingPlayers > li').each(function() {
            var id = $(this).attr("id");
            $(this).click(function() {
                getRecentData(id)
            });
        })
    });
  });
});