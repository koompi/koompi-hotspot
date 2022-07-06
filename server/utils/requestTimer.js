const {getApi} = require("../config/connectSelendra");

class Api {
    constructor() {
      this.api = getApi();
    }
  }


module.exports = Api;