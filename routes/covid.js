const express = require("express");
const axios = require("axios");
const router = express.Router();
const StateMap = require("./../services/stateMap");
const MongoWrapper = require("./../services/db");

const getLastSevenDayData = (timeSeriesData) =>{
  const len=timeSeriesData.length ;
  return timeSeriesData.slice(len-7);
}
/* GET users listing. */
router.get("/", function(req, res, next) {
  axios
    .get("https://api.covid19india.org/data.json")
    .then(function(response) {
      // handle success
      let stateList = response.data.statewise;
      const {cases_time_series} = response.data;
      const timeAnalysis =  getLastSevenDayData(cases_time_series);
     const stateWiseData = StateMap.getStateList(stateList);
     MongoWrapper.storeDelta(stateWiseData,
      (err, data) => {
        const response = { totalCases: stateWiseData, delta : {},timeAnalysis }
        if (err) res.send(response);
       
        if (data){
          const {isUpdateAt, deltaList} = data;
          const filteredDeltaList = deltaList.filter(d => d.isChanged);
          response.delta = {
            isUpdateAt,
            deltaList: filteredDeltaList
          }
          res.send(response);
        } 
        if(!err && !data) res.send(response);
      });
      
    })
    .catch(function(error) {
      // handle error
      res.error(error);
    });
  // const data = [{"state":"Total","confirmed":"1440","deaths":"47","recovered":"140","lastupdatedtime":"31/03/2020 14:12:24"},{"state":"Maharashtra","confirmed":"248","deaths":"10","recovered":"39","lastupdatedtime":"31/03/2020 11:42:36"},{"state":"Kerala","confirmed":"234","deaths":"2","recovered":"20","lastupdatedtime":"31/03/2020 09:07:27"},{"state":"Delhi","confirmed":"97","deaths":"2","recovered":"6","lastupdatedtime":"30/03/2020 20:52:24"},{"state":"Uttar Pradesh","confirmed":"101","deaths":"0","recovered":"17","lastupdatedtime":"31/03/2020 10:37:25"},{"state":"Karnataka","confirmed":"98","deaths":"3","recovered":"6","lastupdatedtime":"31/03/2020 13:47:27"},{"state":"Rajasthan","confirmed":"93","deaths":"0","recovered":"3","lastupdatedtime":"31/03/2020 10:02:24"},{"state":"Telangana","confirmed":"77","deaths":"8","recovered":"14","lastupdatedtime":"30/03/2020 21:27:31"},{"state":"Gujarat","confirmed":"73","deaths":"6","recovered":"5","lastupdatedtime":"31/03/2020 11:12:26"},{"state":"Tamil Nadu","confirmed":"74","deaths":"1","recovered":"4","lastupdatedtime":"31/03/2020 11:42:41"},{"state":"Jammu and Kashmir","confirmed":"55","deaths":"2","recovered":"1","lastupdatedtime":"31/03/2020 14:12:26"},{"state":"Madhya Pradesh","confirmed":"66","deaths":"4","recovered":"0","lastupdatedtime":"31/03/2020 11:32:30"},{"state":"Punjab","confirmed":"41","deaths":"3","recovered":"1","lastupdatedtime":"30/03/2020 23:47:25"},{"state":"Haryana","confirmed":"36","deaths":"0","recovered":"17","lastupdatedtime":"29/03/2020 01:27:24"},{"state":"Andhra Pradesh","confirmed":"40","deaths":"0","recovered":"1","lastupdatedtime":"31/03/2020 12:07:28"},{"state":"West Bengal","confirmed":"26","deaths":"4","recovered":"0","lastupdatedtime":"31/03/2020 11:42:50"},{"state":"Bihar","confirmed":"16","deaths":"1","recovered":"0","lastupdatedtime":"31/03/2020 10:47:30"},{"state":"Ladakh","confirmed":"13","deaths":"0","recovered":"3","lastupdatedtime":"27/03/2020 11:52:25"},{"state":"Chandigarh","confirmed":"13","deaths":"0","recovered":"0","lastupdatedtime":"30/03/2020 17:37:29"},{"state":"Andaman and Nicobar Islands","confirmed":"10","deaths":"0","recovered":"0","lastupdatedtime":"30/03/2020 11:27:27"},{"state":"Chhattisgarh","confirmed":"8","deaths":"0","recovered":"0","lastupdatedtime":"27/03/2020 21:17:25"},{"state":"Uttarakhand","confirmed":"7","deaths":"0","recovered":"2","lastupdatedtime":"30/03/2020 06:27:24"},{"state":"Goa","confirmed":"5","deaths":"0","recovered":"0","lastupdatedtime":"29/03/2020 18:52:25"},{"state":"Himachal Pradesh","confirmed":"3","deaths":"1","recovered":"1","lastupdatedtime":"30/03/2020 19:00:43"},{"state":"Odisha","confirmed":"3","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Manipur","confirmed":"1","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Mizoram","confirmed":"1","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Puducherry","confirmed":"1","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Arunachal Pradesh","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Assam","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Dadra and Nagar Haveli","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Daman and Diu","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Jharkhand","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Lakshadweep","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Meghalaya","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Nagaland","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Sikkim","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"},{"state":"Tripura","confirmed":"0","deaths":"0","recovered":"0","lastupdatedtime":"26/03/2020 07:19:29"}];
  // res.send(data);
 
});

router.get("/today", function(req, res, next) {
  axios
    .get("https://api.covid19india.org/data.json")
    .then(function(response) {
      
      let stateList = response.data.statewise;
      
     const todayList = StateMap.getTodayData(stateList);
      res.send(todayList);
    })
    .catch(function(error) {
      // handle error
      res.send(error);
    });
 
});

router.get("/delta", function(req, res, next) {
  axios
    .get("http://localhost:3000/covid-data/today")
    .then(function(response) {
     const delta = StateMap.getDelta();
      res.send(delta);
    })
    .catch(function(error) {
      // handle error
      console.log(error);
      res.send(error);
    });
 
});

module.exports = router;
