var PouchDB = require('pouchdb');
var $q = require('q');
var pouch = function() {
	var _self = this;
	this.localDb = {};

	this.initDB = function(dbName) {
      // create database or open if it is already
      _self.localDb[dbName] = new PouchDB(dbName);
    };
    this.destroyDatabase = function(dbName){
      var _db = _self.localDb[dbName];
      return $q.when(_db.destroy());
    };

    this.resetDatabase = function(dbName, callback) {
      var _db = _self.localDb[dbName];
      _db.destroy().then(function() {
        _db = new PouchDB(dbName, { adapter: 'websql' });
        callback();
      })
    };

    this.getInfoDataBase = function(dbName){
      var _db = _self.localDb[dbName];
      return $q.when(_db.info());
    };
    // add new document to database
    this.addDoc = function(dbName, doc){
      var _db = _self.localDb[dbName];
      return $q.when(_db.put(doc));
    };
    // update a document to database
    this.updateDoc = function(dbName, doc){
      var _db = _self.localDb[dbName];
      return $q.when(_db.put(doc));
    };
    // delete a document to database
    this.deleteDoc = function(dbName, doc){
      var _db = _self.localDb[dbName];
      return $q.when(_db.remove(doc));
    };
    // add, delete, update documents to database
    this.bulkDocs = function(dbName, docs){
      var _db = _self.localDb[dbName];
      return $q.when(_db.bulkDocs(docs));
    };
    this.getDocById = function(dbName, id){
      var _db = _self.localDb[dbName];
      return $q.when(_db.get(id));
    };
    this.getAllDocs = function(dbName){
      var _db = _self.localDb[dbName];
      return $q.when(_db.allDocs({ include_docs: true}))
        .then(function(docs) {
          // Each row has a .doc object and we just want to send an 
          // array of contact objects back to the calling controller,
          // so let's map the array to contain just the .doc objects.
          var allData = docs.rows.map(function(row) {
              return row.doc;
          });
          return allData;
      });
    };
};

module.exports = pouch;