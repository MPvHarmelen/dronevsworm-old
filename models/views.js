//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// VIEWS /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

var express = require('express.io');
var path = require('path');
var app = express().http().io()

// view engine setup
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Broadcast all draw clicks.
app.io.route('drawClick', function(req) {
    req.io.broadcast('draw', req.data)
})

// Send client html.
app.get('/overview', function(req, res) {

    console.log(lstDrone[0].client)
    res.render('overview', {
      lstDrone: lstDrone
    });

})

app.get('/draw', function(req, res) {
    res.render('draw', {});
})




app.listen(3000)
