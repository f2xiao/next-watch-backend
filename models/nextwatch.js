const mongoose = require("mongoose");

const nextwatchSchema = mongoose.Schema({
  watch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Watch",
    require: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
});
// a compound unique index ensures that each combination of watch_id and user_id is unique across the collection
nextwatchSchema.index({ watch_id: 1, user_id: 1 }, { unique: true });

nextwatchSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Nextwatch", nextwatchSchema);
