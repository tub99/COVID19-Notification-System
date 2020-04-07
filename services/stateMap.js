function StateMap() {
  this.deltaMap = {};

  const initMap = (state) => {
    if (!this.deltaMap[state]) {
      this.deltaMap[state] = {
        current: {},
      };
    }
  };
  this.getStateList = (stateData) => {
    return stateData.map((data) => {
      const {
        state,
        confirmed,
        deaths,
        recovered,
        lastupdatedtime,
        delta,
      } = data;
      if (!this.deltaMap[state]) {
        this.deltaMap[state] = {
          current: {},
          prev: {},
        };
        this.deltaMap[state]["prev"] = delta;
      }

      return {
        state,
        confirmed,
        deaths,
        recovered,
        lastupdatedtime,
      };
    });
  };

  this.findDelta = (stateWiseData, deltaMap) => {
    let updateDeltaMap = Object.assign({}, deltaMap);
    const getDeltaStateWise = (current, prev) => {
      let isConfirmed = current.confirmed - prev.confirmed;
      let isDead = current.deaths - prev.deaths;
      let isRecovered = current.recovered - prev.recovered;

      isConfirmed = isConfirmed < 0 ? 0 : isConfirmed;
      isDead = isDead < 0 ? 0 : isDead;
      isRecovered = isRecovered < 0 ? 0 : isRecovered;
      const { state } = current;
      if (state === "Total" && !(isConfirmed || isDead || isRecovered)) {
        return null;
      }
      if (isDead || isRecovered || isConfirmed) {
        return {
          isChanged: true,
          ...current,
          isDead,
          isRecovered,
          isConfirmed,
        };
      } else {
        return {
          isChanged: false,
          ...current,
          isDead,
          isRecovered,
          isConfirmed,
        };
      }
    };

    const isAnyUpdate = getDeltaStateWise(stateWiseData[0], deltaMap["Total"]);
    if (isAnyUpdate) {
      for (const [i,stateData] of stateWiseData.entries()) {
        const {state} = stateData;
        const current = stateWiseData[i];
        const prev = deltaMap[state];
        const delta = getDeltaStateWise(current, prev);
        updateDeltaMap[state] = delta;
      }
    } else {
      //change all isChanged
      for (const deltaKey in deltaMap) {
        deltaMap[deltaKey]["isChanged"] = false;
      }
    }
    return updateDeltaMap;
  };

  this.getFilteredDeltaList = (deltaMap)=>{
    const deltaList = [];
    for (const deltaKey in deltaMap) {
      if(deltaMap[deltaKey]["isChanged"]){
        deltaList.push(deltaMap[deltaKey]);
      }
    }
    return deltaList;
  }

  this.getTodayData = (stateData) => {
    return stateData.map((s) => {
      const { deltaconfirmed, deltadeaths, deltarecovered, state } = s;
      return {
        state,
        confirmed: deltaconfirmed,
        deaths: deltadeaths,
        recovered: deltarecovered,
      };
    });
  };

  this.initDelta = (stateWiseData) => {
    let stateMap = {};
    stateWiseData.forEach((data) => {
      const { state, confirmed, deaths, recovered, lastupdatedtime } = data;
      if(!stateMap[state]){
        stateMap[state] = {
          state,
          confirmed,
          deaths,
          recovered,
          lastupdatedtime,
          isDead: 0,
          isRecovered: 0,
          isConfirmed: 0,
          isChanged: false,
        };
      }
    });
    return stateMap;
  };
}

module.exports = new StateMap();
