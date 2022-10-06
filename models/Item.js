const { Schema, model, ObjectId } = require("mongoose");

const Item = new Schema({
  item: { type: Array },
});

module.exports = model("Item", Item);
