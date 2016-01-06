$( document ).ready(function() {
    $("#btnSearch").click(findPlayers("Cab"));
}
function getRecentData()
{
    $.get("http://cors.io/?u=http://www.fangraphs.com/statss.aspx?playerid=13110",
        function(data) 
        {
            var tableNodesIndex, tableRowIndex;
            var careerData = []
            var html = $.parseHTML(data);
            $.each( html, function( tableNodesIndex, el ) {
              if (tableNodesIndex === 32)
              {
                var table = $(el.innerHTML).find("#SeasonStats1_dgSeason11_ctl00")[0];
                for(tableNodesIndex = 0; tableNodesIndex < table.childNodes.length; tableNodesIndex++)
                {
                    if (table.childNodes[tableNodesIndex].nodeName === "TBODY")
                    {
                        console.log(tableNodesIndex);
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
                var averageCareerData = calculateAverages(careerData.slice(0, -2));
                populateTable(averageCareerData, "#careerAverage");

                var averageCareerData = calculateAverages(careerData.slice(careerData.length - 4, careerData.length - 2));
                populateTable(averageCareerData, "#threeYearAverage");

                var averageCareerData = calculateAverages(careerData.slice(-1));
                populateTable(averageCareerData, "#currentYear");
              }
            });
        });
		
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
        var i = 0;

        var Games = 0, PlateAppearances = 0, Homeruns = 0, Runs = 0, RBIs = 0, Steals = 0, WalkRate = 0, StrikeOutRate = 0;
        var IsolatedPower = 0, BABIP = 0, BattingAverage = 0, OnBasePercentage = 0, SluggingPercentage = 0;
        var validYears = 0;
        for (i; i < dataSet.length; i++)
        {
            if (!dataSet[i])
            {
                continue;
            }
            Games += dataSet[i].Games;
            PlateAppearances += dataSet[i].PlateAppearances;
            Homeruns += dataSet[i].Homeruns;
            Runs += dataSet[i].Runs;
            RBIs += dataSet[i].RBIs;
            Steals += dataSet[i].Steals;
            WalkRate += dataSet[i].WalkRate;
            StrikeOutRate += dataSet[i].StrikeOutRate;
            IsolatedPower += dataSet[i].IsolatedPower;
            BABIP += dataSet[i].BABIP;
            BattingAverage += dataSet[i].BattingAverage;
            OnBasePercentage += dataSet[i].OnBasePercentage;
            SluggingPercentage += dataSet[i].SluggingPercentage;
            validYears++;
        }
        if (validYears > 0)
        {
            Games = (Games / validYears).toFixed(0);
            PlateAppearances = (PlateAppearances / i).toFixed(0);
            Homeruns = (Homeruns / validYears).toFixed(0);
            Runs = (Runs / validYears).toFixed(0);
            RBIs = (RBIs / validYears).toFixed(0);
            Steals = (Steals / validYears).toFixed(0);
            WalkRate = (WalkRate / validYears).toFixed(3);
            IsolatedPower = (IsolatedPower / validYears).toFixed(3);
            BABIP = (BABIP / validYears).toFixed(3);
            BattingAverage = (BattingAverage / validYears).toFixed(3);
            OnBasePercentage = (OnBasePercentage / validYears).toFixed(3);
            SluggingPercentage = (SluggingPercentage / validYears).toFixed(3);
        }
        else
        {
            Games = 0;
            PlateAppearances = 0;
            Homeruns = 0;
            Runs = 0;
            RBIs = 0;
            Steals = 0;
            WalkRate = 0;
            IsolatedPower = 0;
            BABIP = 0;
            BattingAverage = 0;
            OnBasePercentage = 0;
            SluggingPercentage = 0;
        }
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

    function populateTable(averagedData, tableRowId)
    {
        var tableRowString = ""
        for (datum in averagedData)
        {
            tableRowString += "<td>" + averagedData[datum] + "</td>"
        }
        $(tableRowId).append(tableRowString);
    }
}