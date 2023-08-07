const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        first: {
            type: String,
            required: true
        },     
        last: {
            type: String,
            required: true
        },
    },
    avatar: {
        type: String,               
    },
    email: {
        type: String,
        required: true
    },
    
    provider: {
        type: String,
        enum: ["google"],
        required: function checkRequiredOrNot() {            
            return this.password ? false : true;
          } 
          
    },
    password : {
        type: String,
        required: function checkRequiredOrNot() {            
            return this.provider && this.provider == "google" ? false : true;
          } 
    }
    
}, {timestamps:true});


const User = mongoose.model("User", userSchema);
module.exports = User