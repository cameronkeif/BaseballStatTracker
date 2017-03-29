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

function calculateWalkPercentage(plateAppearances, walks, precision)
{
    return decimalRound((walks / plateAppearances) * 100, precision);
}

function calculateStrikeoutPercentage(plateAppearances, strikeouts, precision)
{
    return decimalRound((strikeouts / plateAppearances) * 100, precision);
}

function calculateSluggingPercentage(atBats, singles, doubles, triples, homeruns, precision)
{
    return decimalRound((singles + 2 * doubles + 3 * triples + 4 * homeruns) / atBats, precision);
}

function calculateOnBasePercentage(atBats, hitByPitch, hits, sacrificeFlys, walks, precision)
{
    return decimalRound((hits + walks + hitByPitch) / (atBats + walks + hitByPitch + sacrificeFlys), precision);
}

function calculateBabip(atBats, hits, homeruns, sacrificeFlys, strikeouts, precision)
{
    return decimalRound((hits - homeruns) / (atBats - homeruns - strikeouts + sacrificeFlys), precision);
}

function calculateIsolatedPower(atBats, doubles, triples, homeruns, precision)
{
    return decimalRound((doubles + 2 * triples + 3 * homeruns) / atBats, precision);
}

function generateArrayForTablePopulation(data, label, numberOfSeasons)
{
    var tableDataArray = [];
    var i;
    var totals;
    var stat;
    var RATIO_STAT_PRECISION_DIGITS = 3;
    var COUNTING_STAT_PRECISION_DIGITS = 1;
    var PERCENTAGE_STAT_PRECISION_DIGITS = 1;

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

    tableDataArray[0] = label;
    tableDataArray[1] = decimalRound(totals['Games Played'] / numberOfSeasons, COUNTING_STAT_PRECISION_DIGITS);
    tableDataArray[2] = decimalRound(totals['Plate Apperances'] / numberOfSeasons, COUNTING_STAT_PRECISION_DIGITS);
    tableDataArray[3] = decimalRound(totals['Home Runs'] / numberOfSeasons, COUNTING_STAT_PRECISION_DIGITS);
    tableDataArray[4] = decimalRound(totals['Runs'] / numberOfSeasons, COUNTING_STAT_PRECISION_DIGITS);
    tableDataArray[5] = decimalRound(totals['RBIs'] / numberOfSeasons, COUNTING_STAT_PRECISION_DIGITS);
    tableDataArray[6] = decimalRound(totals['Steals'] / numberOfSeasons, COUNTING_STAT_PRECISION_DIGITS);

    tableDataArray[7] = calculateWalkPercentage(totals['Plate Apperances'], totals['Walks'], PERCENTAGE_STAT_PRECISION_DIGITS);
    tableDataArray[8] = calculateStrikeoutPercentage(totals['Plate Apperances'], totals['Strikeouts'], PERCENTAGE_STAT_PRECISION_DIGITS);
    
    tableDataArray[9] = calculateIsolatedPower(totals['At Bats'], totals['Doubles'], totals['Triples'], totals['Home Runs'], RATIO_STAT_PRECISION_DIGITS);;
    tableDataArray[10] = calculateBabip(totals['At Bats'], totals['Hits'], totals['Home Runs'], totals['Sacrifice Flys'], totals['Strikeouts'], RATIO_STAT_PRECISION_DIGITS);
    tableDataArray[11] = calculateBattingAverage(totals['Plate Apperances'], totals['Hits'], RATIO_STAT_PRECISION_DIGITS);
    tableDataArray[12] = calculateOnBasePercentage(totals['At Bats'], totals['Hit By Pitch'], totals['Hits'], totals['Sacrifice Flys'], totals['Walks'], RATIO_STAT_PRECISION_DIGITS);
    tableDataArray[13] = calculateSluggingPercentage(totals['At Bats'], totals['Singles'], totals['Doubles'], totals['Triples'], totals['Home Runs'], RATIO_STAT_PRECISION_DIGITS);

    return tableDataArray;
}

function getRecentData(playerId)
{
    var careerAverage, threeYearAverage, currentYear;
    clearData();
    $.ajax({
        type: 'GET',
        url: "getPlayerData",
        data: {playerId: playerId},
        success: function(data) {
            data = JSON.parse(data);
            careerAverage = generateArrayForTablePopulation(data, 'Career Average', data.length);
            $('#careerAverage').append(arrayToTableCells(careerAverage))

            threeYearAverage = generateArrayForTablePopulation(data, 'Three Year Average', 3);
            $('#threeYearAverage').append(arrayToTableCells(threeYearAverage))
            
            currentYear = generateArrayForTablePopulation(data, 'Current Year', 1);
            $('#currentYear').append(arrayToTableCells(currentYear))
        }
    });
}

$(document).ready(function() {
    initializeData();
    $("#btnSearch").click(function() {
        if ($("#playerSearch").val().length < 3) {
            alert('Please type at least 3 characters.');
            return;
        }
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