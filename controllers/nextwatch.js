// const jwt = require("jsonwebtoken");
const Nextwatch = require("../models/nextwatch");
const User = require("../models/user");
const logger = require("../utils/logger");

const getAll = async (request, response) => {
  const nextwatches = await Nextwatch.find({
    user_id: request.user.user_id,
  }).populate("watch_id", {
    title: 1,
    category: 1,
  });

  if (!nextwatches) {
    response.status(401).json({ error: "Unauthorized" });
  }
  response.status(200).json(nextwatches);
};

const getOne = async (request, response) => {
  const user = await User.findById(request.user.user_id);

  if (!user) {
    response.status(401).json({ error: "Unauthorized" });
  } else {
    const nextwatch = await Nextwatch.find({
      _id: request.params.id,
      user_id: user._id,
    });
    if (nextwatch) {
      response.status(200).json(nextwatch);
    } else {
      response.status(404).end();
    }
  }
};

const getOneWatchId = async (request, response) => {
  logger.info(request.params.watchId);

  const user = await User.findById(request.user.user_id);

  if (!user) {
    response.status(401).json({ error: "Unauthorized" });
  } else {
    const nextwatch = await Nextwatch.findOne({
      watch_id: request.params.watchId,
      user_id: user._id,
    });

    logger.info(nextwatch);
    if (nextwatch) {
      response.status(200).json(nextwatch);
    } else {
      response.status(404).json({ message: "can't find it" });
    }
  }
};

const create = async (request, response) => {
  const { watch_id } = request.body;

  if (!watch_id) {
    return response
      .status(401)
      .json({ error: "watch_id is missing in the request body" });
  } else {
    const user = await User.findById(request.user.user_id);

    if (!user) {
      response.status(401).json({ error: "Unauthorized" });
    }

    const nextwatch = new Nextwatch({
      watch_id: watch_id,
      user_id: user._id,
    });

    const savedNextwatch = await nextwatch.save();
    user.nextwatches = user.nextwatches.concat(savedNextwatch._id);
    await user.save();

    response.status(201).json(savedNextwatch);
  }
};

const updateRating = async (request, response) => {
  const { rating } = request.body;

  if (!rating) {
    return response
      .status(401)
      .json({ error: "rating is missing in the request body" });
  } else {
    const user = await User.findById(request.user.user_id);

    if (!user) {
      response.status(401).json({ error: "Unauthorized" });
    } else {
      const updatedNextwatch = await Nextwatch.findByIdAndUpdate(
        request.params.id,
        { $set: { rating: Number(rating) } }, // Define the update operation
        {
          new: true, // Return the updated document
        }
      );
      response.status(200).json({ message: "Update the rating successfully" });
    }
  }
};

const deleteOne = async (request, response) => {
  const user = await User.findById(request.user.user_id);

  if (!user) {
    response.status(401).json({ error: "Unauthorized" });
  } else {
    const deletedNextwatch = await Nextwatch.deleteOne({
      _id: request.params.id,
    });

    // also delete the one in the user.nextwatches array
    const deletedItem = await User.updateOne(
      { _id: user._id },
      { $pull: { nextwatches: request.params.id } }
    );
    response.status(204).end();
  }
};

module.exports = {
  getAll,
  getOne,
  getOneWatchId,
  create,
  updateRating,
  deleteOne,
};
