const Watch = require("../models/watch");
const tmdbData = require("../utils/seedData");
const logger = require("../utils/logger");
// uncomment this line of code to seed the data to the mongodb at the first run initially then comment it out
// tmdbData.seedData(Watch);

const getAll = async (_request, response) => {
  try {
    const data = await Watch.find({});

    response.status(200).json(data);
  } catch (error) {
    response.status(400).send(`Error retrieving Watches: ${error}`);
  }
};

const findOne = async (request, response) => {
  try {
    const data = await Watch.findById(request.params.id);
    logger.info(data);

    response.status(200).json(data);
  } catch (error) {
    res.status(400).send(`Error retrieving Watches: ${err}`);
  }
};

module.exports = {
  getAll,
  findOne,
};
