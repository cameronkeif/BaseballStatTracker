function getRecentData()
{
    $.ajaxPrefilter( function (options) {
      if (options.crossDomain && jQuery.support.cors) {
        var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
        options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
        //options.url = "http://cors.corsproxy.io/url=" + options.url;
      }
    });

    $.get("http://www.fangraphs.com/statss.aspx?playerid=10231",
        function(data) 
        {
            var i, j;
            var nodeNames = [];
            var html = $.parseHTML(data);
            $.each( html, function( i, el ) {
              if (i === 32)
              {
                var table = $(el.innerHTML).find("#SeasonStats1_dgSeason11_ctl00")[0];
                for(i = 0; i < table.childNodes.length; i++)
                {
                    if (table.childNodes[i].nodeName === "TBODY")
                    {
                        console.log(i);
                        for(j = 0; j < table.childNodes[i].childNodes.length; j++)
                        {
                            if (table.childNodes[i].childNodes[j].className === "rgRow" ||
                                table.childNodes[i].childNodes[j].className === "rgAltRow")
                            {
                                //console.log(j, table.childNodes[i].childNodes[j].innerHTML);
                                nodeNames.push(j);
                            }
                        }
                    }
                }
              }
            });
            console.log(nodeNames);
        });
}