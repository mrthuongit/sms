var fs = require('fs'); // import library to process file system
var winston = require('winston');
var ConfigReader = require('./erplibs/config_reader.js');
var bodyParser = require('body-parser');
var _ = require('underscore');
require('./response');
var API = require('./erplibs/api.js');
var PoucbDB = require('./erplibs/database/pouchDB.js');

var systemAPI = {};
var configReader = new ConfigReader();
//########################## init logger for system ###############################################
systemAPI.main_config = configReader.readConfig(__dirname + "/../configuration/log.sh");
var logger = null;
if (systemAPI.main_config['logger.showConsole'] === 'true') {
    logger = new(winston.Logger)({
        transports: [
            new(winston.transports.Console)({
                level: 'debug'
            }),
            new(winston.transports.File)({
                filename: systemAPI.main_config["logger.path"] + 'emadebug.log'
            })
        ]
    });
} else {
    logger = new(winston.Logger)({
        transports: [
            new(winston.transports.File)({
                filename: systemAPI.main_config["logger.path"] + 'emadebug.log'
            })
        ]
    });
}

loggerObject = logger;
logerr = function(msg, err) {
    console.log(msg, err);
    if (loggerObject) {
        msg = msg || 'Logger';
        err = err || new Error('error at');

        loggerObject.error(msg);
        if (typeof err !== 'object') {
            err = {
                error: err
            };
        }

        if (!err.stack) {
            var stack = (new Error()).stack;
            err.stack = stack;
        }
        loggerObject.error(err.stack);
    }
};

//#####################################################################################################
var dbConfigs = configReader.readConfig(__dirname + "/../configuration/erpdb.sh");
var express = require('express'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    cookieParser = require('cookie-parser'),
    connect = require('connect'),
    session = require('cookie-session');

var app = express();
//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
    next();
};

app.use(allowCrossDomain);
//Set limit of request
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
var sessionStore = new connect.middleware.session.MemoryStore();

//##################################### init connect with openERP server
/**
 * read address openERP server:
 * @host
 * @port
 * @dbName
 */
var api = new API(dbConfigs, logger);

app.use(compress());
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
    secret: 'POS  is beautiful',
    key: "pos.session",
    store: sessionStore,
    cookie: {
        path: '/',
        httpOnly: false
    }
}));

var jwt = require('jsonwebtoken'); // for generation token oath
jwt.secret_key = "ema-secret-key";

//############################## POST - GET method ###################################
app.post('/api/getListMmsByState', api.getListMmsByState); // only for smart-admin
app.post('/api/createMms', api.createMms); // only for smart-admin
app.post('/api/updateStateMms', api.updateStateMms); // only for smart-admin
app.get('/locale', function(req, res) {
    var src = fs.readFileSync(__dirname + "/../configuration/locale", {
        encoding: "utf8"
    });
    res.send(src.trim(), 200);
});
var extension = {}; // object have some information that optinal for server.
                    // Example: extension = true => server must communicate database
if (dbConfigs.communicate === 'true') {
    extension.communicate = true;
}

var httpServer;
if (module.parent === null) {
    var port = dbConfigs.server_port;
    httpServer = app.listen(port, function(){
        // write file logger: server start is success.
        logger.info("Node-oddoo server listening on port %d in %s mode", port, app.settings.env);
    });
    app.close = function() {
        httpServer.close();
    };
    /*var io = require('socket.io').listen(httpServer, { origins: '*:*' });
    api.io = io;
    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('confirm connect', function (data) {
            api.listSocket[data.user.uid] = {
                socket: socket,
                user: data.user
            };
        });
        socket.on('disconnect', function(){
            Object.keys(api.listSocket).forEach(function(key){
                if(api.listSocket[key].socket.id === socket.id){
                    var user = JSON.parse(JSON.stringify(api.listSocket[key].user));
                    api.updateStatusUserForChat("offline", user);
                    delete api.listSocket[key];
                }
            });
        });
    });*/
}

//##############################################################################################
process.on('SIGTERM', function() {
    logger.info("Closing");
    app.close();
    process.exit(0);
});

process.on('uncaughtException', function(err) {
    logerr('Process on uncaught exception', err);
});

app.on('close', function() {
    logger.info("Closed");
});

module.exports = app;