var ServiceManager = function() {
	this.init = function(app, api, logger, extension) {
		//Check authorized
		//Before loggin, request headers don't contain token, so we need 
		//cancel check author
		
		app.use(function(req, res, next) {
			if (req.method && req.method.toUpperCase() === 'OPTIONS') {
				res.respond("OPTIONS", 200);
				return;
			}
			if ('/api/user/login' === req.url || '/checkLimitDate' || '/getInforFromLicense' === req.url){
				next();
			} else {
				var token = req.headers.authorization || '';
                if (!token) {
                    token = req.query.token || '';
                }
				var check = erpMng.get(token) ? true : false;
				if (check) {
					next();
				} else {
					res.respond("UNAUTHORIZED", ERRCODE.ERR_UNAUTHORIZED);
				}
			}
		});

		// services of user
		var userService 		= new UserService(api, logger);
		app.post('/api/user/login', userService.doLoginAction);
		app.get('/api/user/logout', userService.dologoutAction);
        app.post('/api/user/getAllUserWithoutAdmin', userService.getAllUserWithoutAdmin);
        app.get('/api/user/getAllJobPositions', userService.getAllJobPositions);
        app.post('/api/user/createUser', userService.createUser);
        app.post('/api/user/updateUser', userService.updateUser);
		app.post('/api/user/changePassword', userService.changePassword);
        app.get('/api/user/getAllUser', userService.getAllUser);
	};
};

module.exports = new ServiceManager();