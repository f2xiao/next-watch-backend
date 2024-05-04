// const jwt = require("jsonwebtoken");
const Nextwatch = require("../models/nextwatch");
const User = require("../models/user");
const logger = require("../utils/logger");
const token = require("../utils/token");

// const getTokenFrom = (request) => {
//   const authorization = request.get("authorization");
//   if (authorization && authorization.startsWith("Bearer ")) {
//     return authorization.replace("Bearer ", "");
//   }
//   return null;
// };

const getAll = async (request, response) => {
  const decodedToken = token.decode(request);
  logger.info(decodedToken);
  if (!decodedToken.user_id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.user_id);
  logger.info(user);

  const nextwatches = await Nextwatch.find({
    user_id: user._id,
  }).populate("watch_id", {
    title: 1,
    category: 1,
  });
  response.json(nextwatches);
};

const getOne = async (request, response) => {
  const nextwatch = await Nextwatch.findById(request.params.id);
  if (nextwatch) {
    response.json(nextwatch);
  } else {
    response.status(404).end();
  }
};

const create = async (request, response) => {
  const { watch_id } = request.body;
  // const decodedToken = jwt.verify(
  //   getTokenFrom(request),
  //   process.env.JWT_SECRET
  // );
  const decodedToken = token.decode(request);
  logger.info(decodedToken);
  if (!decodedToken.user_id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.user_id);
  logger.info(user);

  const nextwatch = new Nextwatch({
    watch_id: watch_id,
    user_id: user._id,
  });

  const savedNextwatch = await nextwatch.save();
  user.nextwatches = user.nextwatches.concat(savedNextwatch._id);
  await user.save();

  response.status(201).json(savedNextwatch);
};

const updateRating = async (request, response) => {
  const { rating } = request.body;
  const updatedNextwatch = await Nextwatch.findByIdAndUpdate(
    request.params.id,
    { $set: { rating: Number(rating) } }, // Define the update operation
    {
      new: true, // Return the updated document
    }
  );
  response.json(updatedNextwatch);
};

const deleteOne = async (request, response) => {
  const decodedToken = token.decode(request);
  logger.info(decodedToken);
  if (!decodedToken.user_id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.user_id);
  logger.info(user);
  const deletedNextwatch = await Nextwatch.findByIdAndDelete(request.params.id);
  console.log(user.nextwatches);
  user.nextwatches = user.nextwatches.filter((id) => id !== request.params.id);
  await user.save();
  response.status(204).end();
};

module.exports = { create, getOne, getAll, updateRating, deleteOne };
