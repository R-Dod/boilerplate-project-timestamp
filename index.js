// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const toUnixTime = require('./toUnix')

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});


// current date and timestamp
app.get("/api", function (req, res) {
  var date = new Date();
  res.json({ unix: toUnixTime.toUnixTime(date), utc: date.toUTCString() });
});

// current date and timestamp
app.get("/api/:date", function middleware(req, res, next) {
  var time = req.params.date;
  var date = new Date(time);

  if (isNaN(date.getTime())) {
    const timestamp = parseInt(time);
    if (isNaN(timestamp)) {
      date = null;
    } else date = new Date(timestamp);
  }
  req.date = date;
  next();
},
  function (req, res) {
    let response;
    if (req.date === null) {
      response = { error: "Invalid Date" };
    } else {
      response = { unix: toUnixTime.toUnixTime(req.date), utc: req.date.toUTCString() };
    }
    console.log(req.params.date, response);
    res.json(response);
  });

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
