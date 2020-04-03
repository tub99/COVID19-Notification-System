function StateMap() {
  this.deltaMap = {};

  const initMap = state => {
    if (!this.deltaMap[state]) {
      this.deltaMap[state] = {
        current: {}
      };
    }
  };
  this.getStateList = stateData => {
    return stateData.map(data => {
      const {
        state,
        confirmed,
        deaths,
        recovered,
        lastupdatedtime,
        delta
      } = data;
      if (!this.deltaMap[state]) {
        this.deltaMap[state] = {
          current: {},
          prev: {}
        };
        this.deltaMap[state]["prev"] = delta;
      }

      return {
        state,
        confirmed,
        deaths,
        recovered,
        lastupdatedtime
      };
    });
  };

  this.getTodayData = stateData => {
    return stateData.map(data => {
      const { state, delta, lastupdatedtime } = data;
      this.deltaMap[state]["current"] = delta;

      return {
        state,
        ...delta,
        lastupdatedtime
      };
    });
  };
  this.findDelta = (stateWiseData, deltaList) => {
    const updateDeltaList = [];
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
          isConfirmed
        };
      } else {
        return {
          isChanged: false,
          ...current,
          isDead,
          isRecovered,
          isConfirmed
        }
      }
    };

    const isAnyUpdate = getDeltaStateWise(stateWiseData[0], deltaList[0]);
    if (isAnyUpdate) {
      for(const [i, deltaState] of deltaList.entries()) {
        const current = stateWiseData[i];
        const prev = deltaState;
        const delta = getDeltaStateWise(current, prev);
        updateDeltaList.push(delta);
      }
    }
    return updateDeltaList;
  };
}

module.exports = new StateMap();
