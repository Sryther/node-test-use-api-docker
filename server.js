// Set up
var express             = require('express');
var app                 = express();
var http                = require('http');
var swig                = require('swig');
var morgan              = require('morgan');
var bodyParser          = require('body-parser');
var methodOverride      = require('method-override');

// Server side
var port = 8000;

// Configuration
app.use(morgan('dev'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', false);
swig.setDefaults({ cache: false });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(methodOverride());
app.set('port', port);

app.use(function (req, res, next) {
    // Comment this in production
    console.log(req.body);
    next();
});

var docker = require('./modules/docker')(http);

// Routes
app.get("/", docker.help);
app.get("/containers", docker.getList);
app.post("/containers", docker.postList);
app.get("/containers/create", docker.getCreate);
app.post("/containers/create", docker.postCreate);

app.get("/containers/:id/:address/:port", docker.getContainer);

// Run the server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Server listening on port ', app.get('port'));
});
