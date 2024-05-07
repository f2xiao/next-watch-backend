const mongoose = require("mongoose");
const watchSchema = new mongoose.Schema({
  title: String,
  description: String,
  posterUrl: String,
  backdropUrl: String,
  trailer_youtube: String,
  category: String,
});

watchSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Watch", watchSchema);
