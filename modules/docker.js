module.exports = function (http) {
    module.help = function(req, res) {
        res.render('help', {});
    };

    module.getList = function(req, res) {
        res.render('list', {});
    }

    module.postList = function(req, res) {
        var body = req.body;

        var options = {
            host: body.address,
            port: body.port,
            path: '/containers/json?all=1',
            method: 'GET'
        };

        var req = http.request(options, function(resp) {
            resp.on('data', function (chunk) {
                res.render('list', { containers: JSON.parse(chunk), port: body.port, address: body.address });
            });
        }).on("error", function(e){
            console.log("Got error: " + e.message);
        });

        req.end();
    }

    module.getCreate = function(req, res) {
        res.render('create', {});
    };

    module.postCreate = function(req, res) {
        var body = req.body;

        var options = {
            host: body.address,
            port: body.port,
            path: '/containers/create',
            method: 'POST'
        };

        var req = http.request(options, function(res) {
            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
            });
        });

        req.setHeader('content-type', 'application/json');
        req.write('');
        req.end();
    };

    module.getContainer = function(req, res) {
        var id = req.params.id;
        var address = req.params.address;
        var port = req.params.port;

        var options = {
            host: address,
            port: port,
            path: '/containers/'+id+'/json',
            method: 'GET'
        };

        var req = http.request(options, function(resp) {
            resp.on('data', function (chunk) {
                res.render('container', { container: JSON.parse(chunk) });
            });
        }).on("error", function(e){
            console.log("Got error: " + e.message);
        });

        req.end();
    }

    return module;
};
