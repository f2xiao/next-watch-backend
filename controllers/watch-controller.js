const Watch = require(".././models/watch");

const getAll = async (_request, response) => {
  try {
    const data = await Watch.find({});

    response.status(200).json(data);
  } catch (error) {
    res.status(400).send(`Error retrieving Watches: ${err}`);
  }
};

const findOne = async (request, response) => {
  try {
    const data = await Watch.findById(request.params.id);

    response.status(200).json(data);
  } catch (error) {
    res.status(400).send(`Error retrieving Watches: ${err}`);
  }
};

module.exports = {
  getAll,
  findOne,
};
