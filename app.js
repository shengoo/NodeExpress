
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
var fs = require("fs");
var file = "./test.db";

//載入 sqlite3
var sqlite3 = require("sqlite3").verbose();
//new 一個 sqlite 的 database，檔案是 test.db
var db = new sqlite3.Database(file);

db.serialize(function() {
    //db.run 如果 Staff 資料表不存在，那就建立 Staff 資料表
    db.run("CREATE TABLE IF NOT EXISTS  Stuff (id int,thing TEXT)");
    var stmt = db.prepare("INSERT INTO Stuff VALUES (?)");

    //寫進10筆資料
    for (var i = 0; i<10; i++) {
        stmt.run("staff_number" + i);
    }

    stmt.finalize();

    db.each("SELECT id, thing FROM Stuff", function(err, row) {
        //log 出所有的資料
        console.log(row.id + ": " + row.thing);
    });
});

db.close();