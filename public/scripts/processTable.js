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

function getRecentData(playerId)
{
    clearData();
    $.ajax({
    type: 'GET',
    url: "http://www.baseball-reference.com/statss.aspx?playerid=" + playerId,
    crossDomain: true,
    xhrFields: {
      withCredentials: true
   },
    success: function(data) {
            var tableNodesIndex, tableRowIndex;
            var careerData = []
            var html = $.parseHTML(data);
            $.each( html, function( tableNodesIndex, el ) {
                if(el.innerHTML && el.innerHTML.includes("SeasonStats1_dgSeason11_ctl00"))
                {
                    var table = $(el.innerHTML).find("#SeasonStats1_dgSeason11_ctl00")[0];
                    if (table)
                    {
                        for(tableNodesIndex = 0; tableNodesIndex < table.childNodes.length; tableNodesIndex++)
                        {
                            if (table.childNodes[tableNodesIndex].nodeName === "TBODY")
                            {
                                for(tableRowIndex = 0; tableRowIndex < table.childNodes[tableNodesIndex].childNodes.length; tableRowIndex++)
                                {
                                    if (table.childNodes[tableNodesIndex].childNodes[tableRowIndex].className === "rgRow" ||
                                        table.childNodes[tableNodesIndex].childNodes[tableRowIndex].className === "rgAltRow")
                                    {
                                        careerData.push(parseTableRow(table.childNodes[tableNodesIndex].childNodes[tableRowIndex].innerHTML));
                                    }
                                }
                            }
                        }
                    }
                    var averageCareerData = calculateAverages(careerData.slice(0, -2));
                    populateTable(averageCareerData, "#careerAverage", "Career Average");

                    var averageCareerData = calculateAverages(careerData.slice(careerData.length - 4, careerData.length - 2));
                    populateTable(averageCareerData, "#threeYearAverage", "Three Year Average");

                    var averageCareerData = calculateAverages(careerData.slice(-1));
                    populateTable(averageCareerData, "#currentYear", "Current Year");
                }
            });
        }});
        
    function parseTableRow(tableRow)
    {
        var parsedRow = $.parseHTML(tableRow);
        var PlateAppearances = Number(parsedRow[4].outerText);
        if (PlateAppearances < 150) // Less than 150 PA is not a sizeable data set.
        {
            return;
        }
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
        
        return {
                    Games: Games,
                    PlateAppearances: PlateAppearances,
                    Homeruns: Homeruns,
                    Runs: Runs,
                    RBIs: RBIs,
                    Steals: Steals,
                    WalkRate: WalkRate,
                    StrikeOutRate: StrikeOutRate,
                    IsolatedPower: IsolatedPower,
                    BABIP: BABIP,
                    BattingAverage: BattingAverage,
                    OnBasePercentage: OnBasePercentage,
                    SluggingPercentage: SluggingPercentage

                }
    }

    function calculateAverages(dataSet)
    {
        var validYears = 0;
        var playerData = {
                    Games: 0,
                    PlateAppearances: 0,
                    Homeruns: 0,
                    Runs: 0,
                    RBIs: 0,
                    Steals: 0,
                    WalkRate: 0,
                    StrikeOutRate: 0,
                    IsolatedPower: 0,
                    BABIP: 0,
                    BattingAverage: 0,
                    OnBasePercentage: 0,
                    SluggingPercentage: 0
        }

        for (var i = 0; i < dataSet.length; i++)
        {
            if (!dataSet[i])
            {
                continue;
            }
            playerData.Games += dataSet[i].Games;
            playerData.PlateAppearances += dataSet[i].PlateAppearances;
            playerData.Homeruns += dataSet[i].Homeruns;
            playerData.Runs += dataSet[i].Runs;
            playerData.RBIs += dataSet[i].RBIs;
            playerData.Steals += dataSet[i].Steals;
            playerData.WalkRate += dataSet[i].WalkRate;
            playerData.StrikeOutRate += dataSet[i].StrikeOutRate;
            playerData.IsolatedPower += dataSet[i].IsolatedPower;
            playerData.BABIP += dataSet[i].BABIP;
            playerData.BattingAverage += dataSet[i].BattingAverage;
            playerData.OnBasePercentage += dataSet[i].OnBasePercentage;
            playerData.SluggingPercentage += dataSet[i].SluggingPercentage;
            validYears++;
        }

        if (validYears > 0)
        {
            playerData.Games = (playerData.Games / validYears).toFixed(0);
            playerData.PlateAppearances = (playerData.PlateAppearances / i).toFixed(0);
            playerData.Homeruns = (playerData.Homeruns / validYears).toFixed(0);
            playerData.Runs = (playerData.Runs / validYears).toFixed(0);
            playerData.RBIs = (playerData.RBIs / validYears).toFixed(0);
            playerData.Steals = (playerData.Steals / validYears).toFixed(0);

            playerData.WalkRate = (playerData.WalkRate / validYears).toFixed(2);
            playerData.StrikeOutRate = (playerData.StrikeOutRate / validYears).toFixed(2);

            playerData.IsolatedPower = (playerData.IsolatedPower / validYears).toFixed(3);
            playerData.BABIP = (playerData.BABIP / validYears).toFixed(3);
            playerData.BattingAverage = (playerData.BattingAverage / validYears).toFixed(3);
            playerData.OnBasePercentage = (playerData.OnBasePercentage / validYears).toFixed(3);
            playerData.SluggingPercentage = (playerData.SluggingPercentage / validYears).toFixed(3);
        }
        return playerData;
    }

    function populateTable(averagedData, tableRowId, label)
    {
        var tableRowString = "<td>" + label + "</td>";
        for (datum in averagedData)
        {
            tableRowString += "<td>" + averagedData[datum] + "</td>"
        }
        $(tableRowId).append(tableRowString);
    }
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