const { Schema, model, ObjectId } = require("mongoose");

const Item = new Schema({
  mess: { type: String },
});

module.exports = model("Item", Item);
