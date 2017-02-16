var request = require('request');
var pouchDb = require('./database/pouchDb.js');
var _ = require('underscore');
var API = function(dbConfigs,logger) {
	var share = {}; //the object contain some api to share for another api
	var _self = this;
	this.pouch = new pouchDb();
	this.mmsDbName = "list_mms";
	_self.pouch.initDB(_self.mmsDbName);
	this.password_config = dbConfigs.password;
	this.checkPassword = function(password){
		var flag = true;
		if(_self.password_config != password){
			flag = false;
		}
		return flag;
	}
	
	this.getListMmsByState = function(req, res){
		var param = req.body;
		var state = param.state;
		var password = param.password;
		if(_self.checkPassword(password)){
			_self.pouch.getAllDocs(_self.mmsDbName).then(function(allDocs){
				var listMms;
				if(!state){
					listMms = allDocs;
				} else{
					listMms = _.filter(allDocs, function(doc){
						return doc.state === state;
					});
				}
				res.respond({data: listMms});
			});
		} else{
			res.respond({error: true, message: "password error"});
		}
	};

	this.createMms = function(req, res){
		var param = req.body;
		var password = param.password;
		if(_self.checkPassword(password)){
			_self.pouch.getAllDocs(_self.mmsDbName).then(function(allDocs){
				var _id = (allDocs.length + 1).toString();
				var new_mms_db = [{
					_id: _id,
					body: param.body,
					phones: param.phones,
					state: "open",
					create_date: param.create_date
				}];
				_self.pouch.bulkDocs(_self.mmsDbName, new_mms_db).then(function(result){
					res.respond({id: result[0]});
				});
			});
		} else{
			res.respond({error: true, message: "password error"});
		}
	};

	this.updateStateMms = function(req, res){
		var param = req.body;
		var oldMms = param.mms;
		var state = param.state;
		var password = param.password;
		if(_self.checkPassword(password)){
			_self.pouch.getAllDocs(_self.mmsDbName).then(function(allDocs){
				var existMms = _.find(allDocs, function(doc){
					return doc._id === oldMms._id;
				});
				existMms.state = state;
				existMms.send_date = param.send_date;
				_self.pouch.updateDoc(_self.mmsDbName, existMms).then(function(result){
					res.respond({update: true});
				});
			});
		} else{
			res.respond({error: true, message: "password error"});
		}
	}

};

module.exports = API;