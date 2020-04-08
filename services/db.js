const MongoClient = require("mongodb").MongoClient;
const StateMap = require("./stateMap");

const Constants = {
  MONGODB_URI:
    "mongodb+srv://som99:som99@cluster0-svfkm.mongodb.net/covid_db?retryWrites=true&w=majority"
};
const getCurrentDT = () => {
  var currentdate = new Date();
  var datetime =
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " @ " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();

  return datetime;
};

function MongoWrapper() {
  this.db = null;
  this.init = cb => {
    const uri = Constants.MONGODB_URI;
    const client = new MongoClient(uri);
    client.connect(err => {
      console.log("DB connected");
      this.db = client.db("covid_db");
      cb(true);
    });
  };

  this.storeDelta = function(stateList, cb) {
    const stateWiseData = StateMap.getStateList(stateList);
    
    const deltaCollection = this.db.collection("delta");
    deltaCollection.findOne({ type: "delta" }, (err, item) => {
      if (err) {
        console.log(err);
        cb(err, null);
      }
      if (!item) {
        const stateDeltaMap = StateMap.initDelta(stateWiseData);
        const delta = {
          type: "delta",
          updatedAt: getCurrentDT(),
          deltaMap: stateDeltaMap
        };
        deltaCollection.save(delta, { w: 1 }, (err, result) => {
          if (err) cb(err, null);
          cb(null, result);
        });
      } else {
        const { deltaMap } = item;
        const deltaDiff = StateMap.findDelta(stateWiseData, deltaMap);
        const toUpdateDoc = { deltaMap: deltaDiff, updatedAt: getCurrentDT() }
        if (deltaDiff["Total"]["isChanged"]) {
          deltaCollection.update(
            { type: "delta" },
            { $set: toUpdateDoc },
            (err, res) => {
              if (err){
                console.log('No Updates happened')
                cb(err, null);
              } 
              else{
                console.log('New Updates Happened', res);
                cb(null,toUpdateDoc);
              }
             
            }
          );
        } else {
            cb(null, null);

        }
      }
    });
  };

  this.getDelta = function(cb) {
    const deltaCollection = this.db.collection("delta");
    deltaCollection.findOne({ type: "delta" }, (err, item) => {
      if (err) {
        console.log(err);
        cb(err);
      }
      cb(item);
    });
  };
}

module.exports = new MongoWrapper();
