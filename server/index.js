// server/index.js
'use strict';

var app = require('./app');

var PORT = process.env.PORT || 14196;

app.listen(PORT, function(){
  console.log('App listening on port '+PORT+'!');
});
