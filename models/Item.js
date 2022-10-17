const { Schema, model, ObjectId } = require("mongoose");

const Item = new Schema({
  item: { type: Array },
  weight: { type: Number },
  waypoint: { type: Boolean },
});

module.exports = model("Item", Item);
