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

  this.getDelta = () => {
    const updateList = [];
    for (let delta in this.deltaMap) {
      const current = this.deltaMap[delta]["current"];
      const prev = this.deltaMap[delta]["prev"];
      let isConfirmed = current.confirmed - prev.confirmed;
      let isDead = current.deaths - prev.deaths;
      let isRecovered = current.recovered - prev.recovered;

      isConfirmed = isConfirmed < 0 ? 0 : isConfirmed;
      isDead = isDead < 0 ? 0 : isDead;
      isRecovered = isRecovered < 0 ? 0 : isRecovered;

      if (delta === "Total" && !(isConfirmed || isDead || isRecovered))
        return updateList;
      if (isDead || isRecovered || isConfirmed) {
        const updatedStateData = {
          state: delta,
          isDead,
          isRecovered,
          isConfirmed
        };
        updateList.push(updatedStateData);
      }
      this.deltaMap[delta]["prev"] = current;
    }
    return updateList;
  };
}

module.exports = new StateMap();
