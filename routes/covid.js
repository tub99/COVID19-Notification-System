const express = require("express");
const axios = require("axios");
const router = express.Router();
const StateMap = require("./../services/stateMap");
const MongoWrapper = require("./../services/db");

const getLastSevenDayData = (timeSeriesData, today) => {
  const len = timeSeriesData.length;
  let timeData = [];
   timeData = timeSeriesData.slice(len - 6);
   const {deltaconfirmed,deltadeaths, deltarecovered } = today;
   const todayDate = new Date();
   let todayDay = todayDate.getDate();
   todayDay = (todayDay <=9) ? '0'+todayDay : todayDay;
   const todaysData =  {
    "dailyconfirmed": deltaconfirmed,
    "dailydeceased": deltadeaths,
    "dailyrecovered": deltarecovered,
    "date": todayDay+' '+ todayDate.toLocaleString('default', { month: 'long' })
  };
  timeData.push(todaysData);
  return timeData;
};
/* GET users listing. */
router.get("/", function (req, res, next) {
  // const data = {"totalCases":[{"state":"Total","confirmed":"4254","deaths":"119","recovered":"321","lastupdatedtime":"05/04/2020 23:18:25"},{"state":"Maharashtra","confirmed":"748","deaths":"45","recovered":"56","lastupdatedtime":"05/04/2020 20:22:35"},{"state":"Tamil Nadu","confirmed":"571","deaths":"5","recovered":"8","lastupdatedtime":"05/04/2020 18:47:27"},{"state":"Delhi","confirmed":"503","deaths":"7","recovered":"16","lastupdatedtime":"05/04/2020 21:24:25"},{"state":"Kerala","confirmed":"314","deaths":"2","recovered":"56","lastupdatedtime":"05/04/2020 18:11:26"},{"state":"Telangana","confirmed":"333","deaths":"11","recovered":"33","lastupdatedtime":"05/04/2020 23:18:27"},{"state":"Uttar Pradesh","confirmed":"278","deaths":"3","recovered":"21","lastupdatedtime":"05/04/2020 22:39:30"},{"state":"Rajasthan","confirmed":"260","deaths":"1","recovered":"25","lastupdatedtime":"05/04/2020 22:39:31"},{"state":"Andhra Pradesh","confirmed":"252","deaths":"1","recovered":"5","lastupdatedtime":"05/04/2020 19:38:34"},{"state":"Madhya Pradesh","confirmed":"193","deaths":"12","recovered":"3","lastupdatedtime":"05/04/2020 19:56:31"},{"state":"Karnataka","confirmed":"151","deaths":"4","recovered":"11","lastupdatedtime":"05/04/2020 18:38:28"},{"state":"Gujarat","confirmed":"127","deaths":"11","recovered":"21","lastupdatedtime":"05/04/2020 23:18:30"},{"state":"Jammu and Kashmir","confirmed":"106","deaths":"2","recovered":"4","lastupdatedtime":"05/04/2020 18:11:27"},{"state":"Haryana","confirmed":"90","deaths":"0","recovered":"29","lastupdatedtime":"05/04/2020 16:34:40"},{"state":"Punjab","confirmed":"68","deaths":"6","recovered":"4","lastupdatedtime":"05/04/2020 17:27:25"},{"state":"West Bengal","confirmed":"53","deaths":"6","recovered":"3","lastupdatedtime":"02/04/2020 18:32:26"},{"state":"Bihar","confirmed":"32","deaths":"1","recovered":"3","lastupdatedtime":"04/04/2020 20:06:26"},{"state":"Assam","confirmed":"26","deaths":"0","recovered":"0","lastupdatedtime":"05/04/2020 00:48:26"},{"state":"Uttarakhand","confirmed":"26","deaths":"0","recovered":"4","lastupdatedtime":"05/04/2020 18:11:31"},{"state":"Odisha","confirmed":"39","deaths":"0","recovered":"2","lastupdatedtime":"05/04/2020 21:33:46"},{"state":"Chandigarh","confirmed":"18","deaths":"0","recovered":"5","lastupdatedtime":"05/04/2020 21:41:44"},{"state":"Ladakh","confirmed":"14","deaths":"0","recovered":"3","lastupdatedtime":"27/03/2020 11:52:25"},{"state":"Andaman and Nicobar Islands","confirmed":"10","deaths":"0","recovered":"0","lastupdatedtime":"30/03/2020 11:27:27"},{"state":"Chhattisgarh","confirmed":"10","deaths":"0","recovered":"8","lastupdatedtime":"05/04/2020 20:31:27"},{"state":"Goa","confirmed":"7","deaths":"0","recovered":"0","lastupdatedtime":"04/04/2020 09:42:27"},{"state":"Himachal Pradesh","confirmed":"13","deaths":"2","recovered":"1","lastupdatedtime":"05/04/2020 15:49:35"},{"state":"Puducherry","confirmed":"5","deaths":"0","recovered":"0","lastupdatedtime":"03/04/2020 02:37:27"},{"state":"Jharkhand","confirmed":"3","deaths":"0","recovered":"0","lastupdatedtime":"05/04/2020 14:04:29"},{"state":"Manipur","confirmed":"2","deaths":"0","recovered":"0","lastupdatedtime":"02/04/2020 09:42:34"},{"state":"Mizoram","confirmed":"1","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Arunachal Pradesh","confirmed":"1","deaths":"0","recovered":"0","lastupdatedtime":"02/04/2020 11:42:31"},{"state":"Dadra and Nagar Haveli","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Daman and Diu","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Lakshadweep","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Meghalaya","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Nagaland","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Sikkim","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Tripura","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"}],"delta":{},"timeAnalysis":[{"dailyconfirmed":"190","dailydeceased":"16","dailyrecovered":"35","date":"30 March ","totalconfirmed":"1329","totaldeceased":"43","totalrecovered":"137"},{"dailyconfirmed":"306","dailydeceased":"6","dailyrecovered":"13","date":"31 March ","totalconfirmed":"1635","totaldeceased":"49","totalrecovered":"150"},{"dailyconfirmed":"424","dailydeceased":"7","dailyrecovered":"19","date":"01 April ","totalconfirmed":"2059","totaldeceased":"56","totalrecovered":"169"},{"dailyconfirmed":"486","dailydeceased":"16","dailyrecovered":"22","date":"02 April ","totalconfirmed":"2545","totaldeceased":"72","totalrecovered":"191"},{"dailyconfirmed":"560","dailydeceased":"14","dailyrecovered":"39","date":"03 April ","totalconfirmed":"3105","totaldeceased":"86","totalrecovered":"230"},{"dailyconfirmed":"579","dailydeceased":"13","dailyrecovered":"56","date":"04 April ","totalconfirmed":"3684","totaldeceased":"99","totalrecovered":"286"},{"dailyconfirmed":"570","dailydeceased":"20","dailyrecovered":"35","date":"05 April"}],"today":[{"state":"Total","confirmed":"570","deaths":"20","recovered":"35"},{"state":"Maharashtra","confirmed":"113","deaths":"13","recovered":"4"},{"state":"Tamil Nadu","confirmed":"86","deaths":"2","recovered":"0"},{"state":"Delhi","confirmed":"58","deaths":"1","recovered":"0"},{"state":"Kerala","confirmed":"8","deaths":"0","recovered":"6"},{"state":"Telangana","confirmed":"61","deaths":"0","recovered":"0"},{"state":"Uttar Pradesh","confirmed":"44","deaths":"1","recovered":"0"},{"state":"Rajasthan","confirmed":"54","deaths":"0","recovered":"0"},{"state":"Andhra Pradesh","confirmed":"60","deaths":"0","recovered":"3"},{"state":"Madhya Pradesh","confirmed":"14","deaths":"1","recovered":"3"},{"state":"Karnataka","confirmed":"7","deaths":"0","recovered":"0"},{"state":"Gujarat","confirmed":"19","deaths":"1","recovered":"8"},{"state":"Jammu and Kashmir","confirmed":"14","deaths":"0","recovered":"1"},{"state":"Haryana","confirmed":"6","deaths":"0","recovered":"0"},{"state":"Punjab","confirmed":"3","deaths":"1","recovered":"1"},{"state":"West Bengal","confirmed":"0","deaths":"0","recovered":"0"},{"state":"Bihar","confirmed":"0","deaths":"0","recovered":"0"},{"state":"Assam","confirmed":"0","deaths":"0","recovered":"0"},{"state":"Uttarakhand","confirmed":"4","deaths":"0","recovered":"2"},{"state":"Odisha","confirmed":"18","deaths":"0","recovered":"0"},{"state":"Chandigarh","confirmed":"0","deaths":"0","recovered":"2"},{"state":"Ladakh","confirmed":"0","deaths":"0","recovered":"0"},{"state":"Andaman and Nicobar Islands","confirmed":"0","deaths":"0","recovered":"0"},{"state":"Chhattisgarh","confirmed":"0","deaths":"0","recovered":"5"},{"state":"Goa","confirmed":"0","deaths":"0","recovered":"0"},{"state":"Himachal Pradesh","confirmed":"0","deaths":"0","recovered":"0"},{"state":"Puducherry","confirmed":"0","deaths":"0","recovered":"0"},{"state":"Jharkhand","confirmed":"1","deaths":"0","recovered":"0"},{"state":"Manipur","confirmed":"0","deaths":"0","recovered":"0"},{"state":"Mizoram","confirmed":"0","deaths":"0","recovered":"0"},{"state":"Arunachal Pradesh","confirmed":"0","deaths":"0","recovered":"0"},{"state":"Dadra and Nagar Haveli","confirmed":"0","deaths":"0","recovered":"0"},{"state":"Daman and Diu","confirmed":"0","deaths":"0","recovered":"0"},{"state":"Lakshadweep","confirmed":"0","deaths":"0","recovered":"0"},{"state":"Meghalaya","confirmed":"0","deaths":"0","recovered":"0"},{"state":"Nagaland","confirmed":"0","deaths":"0","recovered":"0"},{"state":"Sikkim","confirmed":"0","deaths":"0","recovered":"0"},{"state":"Tripura","confirmed":"0","deaths":"0","recovered":"0"}]};
  // res.send(data);
  // return;
  axios
    .get("https://api.covid19india.org/data.json")
    .then(function (response) {
      // handle success
      let stateList = response.data.statewise;
      const todaysData = StateMap.getTodayData(stateList);
      const { cases_time_series } = response.data;
      const timeAnalysis = getLastSevenDayData(cases_time_series, stateList[0]);
      const stateWiseData = StateMap.getStateList(stateList);
      const apiResponse = { totalCases: stateWiseData, delta: {}, timeAnalysis, today: todaysData };
      res.send(apiResponse);
      return;
       MongoWrapper.storeDelta(stateWiseData,
        (err, data) => {

          if (err) res.send(apiResponse);

          else if (data){
            const {updatedAt, deltaMap} = data;
            const filteredDeltaList = StateMap.getFilteredDeltaList(deltaMap);
            apiResponse.delta = {
              updatedAt,
              deltaList: filteredDeltaList
            }
            console.log('Delta Response', filteredDeltaList);
            res.send(apiResponse);
          }
          else if(!err && !data) res.send(apiResponse);
        });
    })
    .catch(function (error) {
      // handle error
      res.send({ error });
    });
  // const data = {"totalCases":[{"state":"Total","confirmed":"3108","deaths":"86","recovered":"229","lastupdatedtime":"03/04/2020 23:57:25"},{"state":"Maharashtra","confirmed":"490","deaths":"26","recovered":"50","lastupdatedtime":"03/04/2020 21:12:25"},{"state":"Tamil Nadu","confirmed":"411","deaths":"1","recovered":"6","lastupdatedtime":"03/04/2020 17:37:39"},{"state":"Delhi","confirmed":"386","deaths":"6","recovered":"8","lastupdatedtime":"03/04/2020 23:32:32"},{"state":"Kerala","confirmed":"295","deaths":"2","recovered":"42","lastupdatedtime":"03/04/2020 19:07:40"},{"state":"Uttar Pradesh","confirmed":"174","deaths":"2","recovered":"17","lastupdatedtime":"03/04/2020 23:57:28"},{"state":"Rajasthan","confirmed":"179","deaths":"0","recovered":"3","lastupdatedtime":"03/04/2020 23:32:37"},{"state":"Andhra Pradesh","confirmed":"164","deaths":"1","recovered":"2","lastupdatedtime":"03/04/2020 23:32:41"},{"state":"Telangana","confirmed":"229","deaths":"11","recovered":"32","lastupdatedtime":"03/04/2020 20:27:26"},{"state":"Madhya Pradesh","confirmed":"154","deaths":"8","recovered":"0","lastupdatedtime":"03/04/2020 23:52:32"},{"state":"Karnataka","confirmed":"128","deaths":"4","recovered":"11","lastupdatedtime":"03/04/2020 23:42:33"},{"state":"Gujarat","confirmed":"95","deaths":"9","recovered":"10","lastupdatedtime":"03/04/2020 21:17:31"},{"state":"Jammu and Kashmir","confirmed":"75","deaths":"2","recovered":"3","lastupdatedtime":"03/04/2020 17:37:43"},{"state":"Haryana","confirmed":"58","deaths":"0","recovered":"27","lastupdatedtime":"03/04/2020 20:27:29"},{"state":"West Bengal","confirmed":"53","deaths":"6","recovered":"3","lastupdatedtime":"02/04/2020 18:32:26"},{"state":"Punjab","confirmed":"53","deaths":"5","recovered":"1","lastupdatedtime":"02/04/2020 21:02:25"},{"state":"Bihar","confirmed":"31","deaths":"1","recovered":"3","lastupdatedtime":"03/04/2020 21:12:26"},{"state":"Assam","confirmed":"23","deaths":"0","recovered":"0","lastupdatedtime":"03/04/2020 23:57:32"},{"state":"Chandigarh","confirmed":"18","deaths":"0","recovered":"0","lastupdatedtime":"02/04/2020 18:57:31"},{"state":"Ladakh","confirmed":"14","deaths":"0","recovered":"3","lastupdatedtime":"27/03/2020 11:52:25"},{"state":"Uttarakhand","confirmed":"16","deaths":"0","recovered":"2","lastupdatedtime":"03/04/2020 21:47:26"},{"state":"Andaman and Nicobar Islands","confirmed":"10","deaths":"0","recovered":"0","lastupdatedtime":"30/03/2020 11:27:27"},{"state":"Chhattisgarh","confirmed":"9","deaths":"0","recovered":"3","lastupdatedtime":"31/03/2020 23:07:28"},{"state":"Odisha","confirmed":"20","deaths":"0","recovered":"2","lastupdatedtime":"03/04/2020 23:42:38"},{"state":"Himachal Pradesh","confirmed":"6","deaths":"2","recovered":"1","lastupdatedtime":"03/04/2020 17:17:36"},{"state":"Goa","confirmed":"6","deaths":"0","recovered":"0","lastupdatedtime":"03/04/2020 10:22:24"},{"state":"Puducherry","confirmed":"5","deaths":"0","recovered":"0","lastupdatedtime":"03/04/2020 02:37:27"},{"state":"Jharkhand","confirmed":"2","deaths":"0","recovered":"0","lastupdatedtime":"02/04/2020 19:42:30"},{"state":"Manipur","confirmed":"2","deaths":"0","recovered":"0","lastupdatedtime":"02/04/2020 09:42:34"},{"state":"Mizoram","confirmed":"1","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Arunachal Pradesh","confirmed":"1","deaths":"0","recovered":"0","lastupdatedtime":"02/04/2020 11:42:31"},{"state":"Dadra and Nagar Haveli","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Daman and Diu","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Lakshadweep","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Meghalaya","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Nagaland","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Sikkim","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Tripura","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"}],"delta":{"deltaList":[{"isChanged":true,"state":"Total","confirmed":4000,"deaths":"86","recovered":"229","lastupdatedtime":"03/04/2020 23:57:25","isDead":0,"isRecovered":0,"isConfirmed":892},{"isChanged":true,"state":"Gujarat","confirmed":"95","deaths":"9","recovered":60,"lastupdatedtime":"03/04/2020 21:17:31","isDead":0,"isRecovered":50,"isConfirmed":0},{"isChanged":true,"state":"Jammu and Kashmir","confirmed":89,"deaths":"2","recovered":"3","lastupdatedtime":"03/04/2020 17:37:43","isDead":0,"isRecovered":0,"isConfirmed":14},{"isChanged":true,"state":"West Bengal","confirmed":66,"deaths":"6","recovered":"3","lastupdatedtime":"02/04/2020 18:32:26","isDead":0,"isRecovered":0,"isConfirmed":13},{"isChanged":true,"state":"Punjab","confirmed":"53","deaths":"5","recovered":60,"lastupdatedtime":"02/04/2020 21:02:25","isDead":0,"isRecovered":59,"isConfirmed":0}]},"timeAnalysis":[{"dailyconfirmed":"151","dailydeceased":"3","dailyrecovered":"25","date":"27 March ","totalconfirmed":"886","totaldeceased":"19","totalrecovered":"75"},{"dailyconfirmed":"143","dailydeceased":"5","dailyrecovered":"10","date":"28 March ","totalconfirmed":"1029","totaldeceased":"24","totalrecovered":"85"},{"dailyconfirmed":"110","dailydeceased":"3","dailyrecovered":"17","date":"29 March ","totalconfirmed":"1139","totaldeceased":"27","totalrecovered":"102"},{"dailyconfirmed":"208","dailydeceased":"16","dailyrecovered":"35","date":"30 March ","totalconfirmed":"1347","totaldeceased":"43","totalrecovered":"137"},{"dailyconfirmed":"288","dailydeceased":"6","dailyrecovered":"13","date":"31 March ","totalconfirmed":"1635","totaldeceased":"49","totalrecovered":"150"},{"dailyconfirmed":"424","dailydeceased":"7","dailyrecovered":"19","date":"01 April ","totalconfirmed":"2059","totaldeceased":"56","totalrecovered":"169"},{"dailyconfirmed":"486","dailydeceased":"16","dailyrecovered":"22","date":"02 April ","totalconfirmed":"2545","totaldeceased":"72","totalrecovered":"191"}]};
  // res.send(data);
});

router.get("/today", function (req, res, next) {
  axios
    .get("https://api.covid19india.org/data.json")
    .then(function (response) {
      let stateList = response.data.statewise;

      const todayList = StateMap.getTodayData(stateList);
      res.send(todayList);
    })
    .catch(function (error) {
      // handle error
      res.send(error);
    });
});

router.get("/delta", function (req, res, next) {
  axios
    .get("http://localhost:3000/covid-data/today")
    .then(function (response) {
      const delta = StateMap.getDelta();
      res.send(delta);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      res.send(error);
    });
});

module.exports = router;
