var express = require('express');
var app = express();

app.use(express.static(__dirname + '/build'));
app.get('*', function(req, res, next){
  var err = new Error();
  err.status = 404;
  next(err);
});
app.use(function(err, req, res, next) {
  res.send(err.message || '**no unicorns here **');
});
app.listen(process.env.PORT || 3000);
