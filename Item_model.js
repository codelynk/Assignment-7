const mongoose = require("mongoose")
const itemSchema =new mongoose.Schema({
    itemName: {type: String, required:true},
    description: {type: String, required:true},
    locationFound: {type:String, default:""},
    dateFound: {type:Date, default:Date.now},
    claimed: {type:Boolean, default:false}
})

const Item = new mongoose.model("items", itemSchema)
module.exports = Item
