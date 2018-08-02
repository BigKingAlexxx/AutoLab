var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//Parse data from JSON POST and insert into MYSQL

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');

// Configure MySQL connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'raumluft'
})

//Establish MySQL connection
connection.connect(function (err) {
    if (err)
        throw err
    else {
        console.log('Connected to MySQL');
        // Start the app when connection is ready
        app.listen(9000);
        console.log('Server listening on port 9000');
    }
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/myfile.html'));
});

app.post('/', function (req, res) {
    var jsondata = req.body;
    console.log("Request: ");
    console.log(req.body);
    var values = [];

    for (var i = 0; i < jsondata.length; i++) {

        var d = new Date();
        var n = d.getTime();
        console.log(n);

        values.push([jsondata[i].SensorID, n - jsondata[i].Zeit, jsondata[i].Temperatur, jsondata[i].Luftdruck, jsondata[i].Luftfeuchtigkeit, jsondata[i].CO2, jsondata[i].TVOC]);
    }


    //console.log(values);

//Bulk insert using nested array [ [a,b],[c,d] ] will be flattened to (a,b),(c,d)
    connection.query('INSERT INTO sensor_data (SensorID, Zeit, Temperatur, Luftdruck, Luftfeuchtigkeit, CO2, TVOC) VALUES ?', [values], function(err,result) {
        if (err) {
            res.send('Error');
        }
        else {
            res.send('Success');
        }
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
