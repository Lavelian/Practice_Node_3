const { model, Schema } = require("mongoose");

const messageSchema = new Schema({
    autor: String,
    text:String,
})

const Message = model("message", messageSchema);

module.exports = Message