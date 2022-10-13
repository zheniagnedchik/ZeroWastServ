const { Schema, model, ObjectId } = require("mongoose");

const Item = new Schema({
  item: { type: Array },
  weight: { type: Number },
});

module.exports = model("Item", Item);
