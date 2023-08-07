const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendshipSchema = new Schema({
    participants: {
        type: Array,
        require: true
    },
    status: {
        type: Boolean,
        require: true
    }
    //status == true - friendship status accepted
    /* status == false - friendship request was sent by first user inside participants array and still waiting to be accepted by second user

    if no friendship status exist, it means there's no relation beetween these two users
    */
}, {timestamps:true});


const Friendship = mongoose.model("friendship", friendshipSchema);
module.exports = Friendship