var GoogleSpreadsheets = require('google-spreadsheets');
var Twit = require('twit');
var twitInfo = require('./config.js');

var twitter = new Twit(twitInfo);

GoogleSpreadsheets({
  key: spreadsheets_key
}, function (err, spreadsheet) {
  spreadsheet.worksheets[0].cells({}, function (err, result) {
    var seriesArray = [];
    var numCells = Object.keys(result.cells).length + 1;

    for (var i = 1; i < numCells; i++) {
      if (result.cells[i][1] == undefined) {
        var series = new Object();
        series['end'] = (result.cells[i][2].value);
        series['from'] = (result.cells[i][3].value);

        seriesArray.push(series);

      } else if (result.cells[i][2] == undefined) {
        var series = new Object();
        series['begin'] = (result.cells[i][1].value);
        series['from'] = (result.cells[i][3].value);

        seriesArray.push(series);

      } else {
        var series = new Object();
        series['begin'] = (result.cells[i][1].value);
        series['end'] = (result.cells[i][2].value);
        series['from'] = (result.cells[i][3].value);

        seriesArray.push(series);

      }
    };

    //Get old tweets
    var old = function (y) {
      twitter.get('statuses/user_timeline', {
        screen_name: 'Just2ThingsBot',
        count: 60
      }, function (err, data, response) {
        for (var i = 0; i < data.length; i++) {
          if ((data[i].text) == y) {
            return twoThings();
          } else {
            return post(y);
          }
        }
      })
    }

    //Post Tweet
    var post = function (x) {
      twitter.post('statuses/update', {
        status: x
      }, function (err, data, response) {
        console.log(x);
      })
    }

    //Get a combination
    var twoThings = function () {
      var first = seriesArray[Math.floor(Math.random() * numCells)];
      var second = seriesArray[Math.floor(Math.random() * numCells)];

      if ((first.begin == undefined) || (second.end == undefined) || (first.from == second.from)) {
        twoThings();
      } else {
        var result = first.from + ' + ' + second.from + "\n" + first.begin + ' ' + second.end;
        old(result);
      };
    }

    //Run
    twoThings();
  });
});
