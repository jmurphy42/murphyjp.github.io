/**
 * Created by murphyjp on 12/20/2016.
 */

var commonStocks = ["AMZN", "AAPL", "T", "BAC", "C", "KO", "DIS",
    "EBAY", "FB", "F", "GE", "GOOGL", "INTC", "MSFT", "NKE", "NYT",
    "TWTR", "V", "WFC", "YHOO"];
var fadeDelay = 500; //ms
var refresh = false;
var refreshDelay = 30000; //ms
var timer;

/**
 * User hits Enter in the input box, so act as if button is clicked
 */
$('#symbol').keypress(function (e) {
    if (e.which == 13) {
        $('#symbolBtn').click();
    }
});

/**
 * User clicks toggle button, so change invisible input
 */
function clickSlider(){
    $('#refreshBtn').click();
}

/**
 * Refresh toggle button event
 * Start timer if turning refresh on.
 * Cancel timer if turning refresh off.
 */
$('#refreshBtn').change(function(){
    if (this.checked) {
        clearTimeout(timer);
        timer = setTimeout(getDataTimed, refreshDelay);
    }else{
        clearTimeout(timer);
    }
    refresh = this.checked
});

/**
 * Parses data and fills the information to the HTML data table
 * @param stockIndex - the row to read/fill
 * @param data       - the data dump from the query
 */
function fillData(stockIndex, data) {
    var jData = JSON.parse(data);
    jData = jData['quote'];
    if (length(jData) < 25) {          //if data has multiple quotes, and not just one quote
        jData = jData[stockIndex - 1]; //get the quote
    }                                  //otherwise just continue with the single quote
    var symbol = jData['symbol'].toUpperCase(),
        price = jData['LastTradePriceOnly'],
        change = jData['Change'],
        chgpct = jData['ChangeinPercent'],
        low = jData['DaysLow'],
        high = jData['DaysHigh'],
        volume = jData['Volume'],
        name = jData['Name'],
        mktcap = jData['MarketCapitalization'],
        exchg = jData['StockExchange'];
    var logo = 'Z.png';
    price = commaNumber(price);
    low = commaNumber(low);
    high = commaNumber(high);
    volume = commaNumber(volume);
    mktcap = commaNumber(mktcap);

    if (change==null){change = '-';}
    if (chgpct==null){chgpct = '-';}
    if (high==null){high = '-';}
    if (low==null){low = '-';}

    for (var i = 0; i < commonStocks.length; i++) {
        if (symbol == commonStocks[i]) {  //check if this is a "common stock"
            logo = symbol + '.png';       //if it is, set its logo
        }
    }

    var $row = $('#stock' + stockIndex);

    if (price == null) {                         //if null, this stock doesn't exist
        $row.children().eq(0).html(symbol);
        $row.children().eq(0).css('color', '#9a2e1d');
        $row.children().eq(1).html("");
        $row.children().eq(2).html("");
        $row.children().eq(3).html("");
        $row.children().eq(4).html("");
        $row.children().eq(5).html("");
        $row.children().eq(6).html("");
        $row.children().eq(7).html("");
        $row.children().eq(8).html("");
        $row.children().eq(9).html("");
        $row.children().eq(10).html("");
    } else {                                     //else, it does
        $row.children().eq(0).html(symbol + "<br />" +
            "<a href='https://finance.yahoo.com/quote/" + symbol + "' target='_blank'>" +
            "<img class='imgInfo' src='img\\info.png' />" +
            "</a>");
        $row.children().eq(0).css('color', '#1c4f9a');
        $row.children().eq(1).html("<img class='imgLogo' src='img\\" + logo + "' />");
        $row.children().eq(2).html(price);
        $row.children().eq(3).html(change);
        $row.children().eq(4).html(chgpct);
        $row.children().eq(5).html(low);
        $row.children().eq(6).html(high);
        $row.children().eq(7).html(volume);
        $row.children().eq(8).html(name);
        $row.children().eq(9).html(mktcap);
        $row.children().eq(10).html(exchg);

        var changeN = parseFloat(change);
        var chgpctN = parseFloat(chgpct);
        if (changeN > 0) {
            $row.children().eq(3).css('color', '#1c9a35')
        } else if (changeN < 0) {
            $row.children().eq(3).css('color', '#9a2e1d')
        } else {
            $row.children().eq(3).css('color', 'black')
        }
        if (chgpctN > 0) {
            $row.children().eq(4).css('color', '#1c9a35')
        } else if (chgpctN < 0) {
            $row.children().eq(4).css('color', '#9a2e1d')
        } else {
            $row.children().eq(4).css('color', 'black')
        }
    }

    $row.fadeIn(fadeDelay);
}

/**
 * Determines the number of stocks in the query
 * @param data
 * @returns {Number}
 */
function getNumberOfStocksInQuote(data) {
    var jData = JSON.parse(data);
    if (jData['quote'][1] == null) { //1 quote
        return 1;
    } else {                        //2+ quotes
        return length(jData['quote']);
    }
}

/**
 * Helper method to get the number of elements of an object
 * @param obj object to get length of
 * @returns {Number}
 */
function length(obj) {
    return Object.keys(obj).length;
}

/**
 * Helper method to format number with commas
 * Borrowed from baacke from Stack Overflow; edited by murphyjp
 * @param val number to add commas to
 * @returns {*}
 */
function commaNumber(val) {
    if (val != null) {
        val = val.toString().replace(/,/g, ''); //first remove existing commas
        var valSplit = val.split('.');          //then separate decimals

        while (/(\d+)(\d{3})/.test(valSplit[0].toString())) {
            valSplit[0] = valSplit[0].toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
        }

        if (valSplit.length == 2) {                 //if there were decimals
            val = valSplit[0] + "." + valSplit[1];  //add decimals back
        } else {
            val = valSplit[0];
        }
    }
    return val;
}

/**
 * Hides the stock data table.
 */
function hideData() {
    $('#stockHeader').css('display', 'none');
    $('#timestamp').css('display', 'none');
    $('#stock1').css('display', 'none');
    $('#stock2').css('display', 'none');
    $('#stock3').css('display', 'none');
    $('#stock4').css('display', 'none');
    $('#stock5').css('display', 'none');
    $('#stock6').css('display', 'none');
    $('#stock7').css('display', 'none');
    $('#stock8').css('display', 'none');
    $('#stock9').css('display', 'none');
    $('#stock10').css('display', 'none');
    $('#stock11').css('display', 'none');
    $('#stock12').css('display', 'none');
    $('#stock13').css('display', 'none');
    $('#stock14').css('display', 'none');
    $('#stock15').css('display', 'none');
    $('#stock16').css('display', 'none');
    $('#stock17').css('display', 'none');
    $('#stock18').css('display', 'none');
    $('#stock19').css('display', 'none');
    $('#stock20').css('display', 'none');
}

/**
 * Sets and displays timestamp on page
 */
function setTimestamp(){
    var now = new Date(Date.now());
    $('#ts').html(now);
    $('#timestamp').fadeIn(fadeDelay);
}

/**
 * Checks to see if input has been set, cancels timers if not
 */
function checkInputSet(){
    var symbol = $("#symbol").val();
    symbol = symbol.replace(/\s/g,''); //remove all whitespace
    if (symbol==""){                   //no query? then:
        clearTimeout(timer);           //turn off timers
        var $refreshBtn = $('#refreshBtn');
        if ($refreshBtn.checked){
            $refreshBtn.prop('checked','false');  //turn off refresh
        }
        warning("No stocks are being queried. The refresh will remain off until a query is set.")
    }
}

/**
 * Displays warning
 * @param msg
 */
function warning(msg){
    var $warning = $('#warning');
    $warning.text(msg);
    $warning.fadeIn(fadeDelay);
}

// use jQuery to make web service query to Yahoo's finance API using YQL query
// This function was written by Dr. Urbain and edited by murphyjp
function getDataTimed() {
    checkInputSet();
    hideData();
    var url = "https://query.yahooapis.com/v1/public/yql";
    var symbol = $("#symbol").val();
    var data = encodeURIComponent("select * from yahoo.finance.quotes where symbol in ('" + symbol + "')");
    $.getJSON(url, 'q=' + data + "&format=json&diagnostics=true&env=http://datatables.org/alltables.env")
        .done(function (data) {
            var jData = JSON.stringify(data.query.results);
            var numStocks = getNumberOfStocksInQuote(jData);
            if (numStocks > 20) {
                var err = "There are too many Ticker Symbols in the query. " +
                    "You are limited to 20 stock queries at a time.";
                warning(err);
            } else {
                $('#warning').css('display', 'none');
                $('#stockHeader').fadeIn(fadeDelay);
                for (var i = 1; i <= numStocks; i++) {
                    fillData(i, jData);
                }
            }
            setTimestamp();
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = 'Request failed: ' + textStatus + ", " + error;
            warning(err);
        });

    if(refresh) {
        clearTimeout(timer);
        timer = setTimeout(getDataTimed, refreshDelay);
        checkInputSet();
    }
}