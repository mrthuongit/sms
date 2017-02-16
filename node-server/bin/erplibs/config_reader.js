/**
 * Read config file and return array of configurations
 */
var fs = require('fs');

var ConfigReader = function(){
	this.readConfig = function(configFile){
		//var configDb = __dirname+"/../config/log.sh" ;
		var arrayValue = {};
		var configContents = fs.readFileSync(configFile, {encoding:"utf8"});
		var lines = configContents.split('\n');
		lines.forEach(function(line){
            if(line.indexOf('#') !== 0){
                var splitted = line.split("=");
                if(splitted.length!==2){return;}
                var key = splitted[0].trim();
                var val = splitted[1].trim().replace(/;$/g, "");
                if(val[0] === '"'){ val = val.substring(1);}
                if(val[val.length-1] === '"'){ val = val.substring(0, val.length-1);}
                arrayValue[key] = val;
            }
        });
		return arrayValue;
	};
};

module.exports = ConfigReader;