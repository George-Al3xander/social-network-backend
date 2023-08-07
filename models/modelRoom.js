const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    participants: {
        type: Array,
        required: true
    },   
}, {timestamps:true});


const Room = mongoose.model("room", roomSchema);
module.exports = Room


// {"participants": [
//     {"username": "first_user", "id": "64c14332749e298563428ec8"},
//     {"username": "second_user", "id": "64c14343749e298563428ecc"}
//     ]}


//token - "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0YzEyYTg0ODc1NTAwNDQzODNlZDU3ZCIsIm5hbWUiOnsiZmlyc3QiOiJNci4iLCJsYXN0IjoiQWRtaW4ifSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiJDJhJDEwJDYzZkExYk5WalFwSkNXLml2R2dxdU9sT256a0JFZzV4Vms0VmdvNVZKNWhjVkJVOGhxSHl1IiwiY3JlYXRlZEF0IjoiMjAyMy0wNy0yNlQxNDoxNTozMi44MTlaIiwidXBkYXRlZEF0IjoiMjAyMy0wNy0yNlQxNDoxNTozMi44MTlaIiwiX192IjowfSwiaWF0IjoxNjkwMzg4NTU5fQ.eV5nuV3HbypCLETrA4eFbfsG6MyH2Xl499pDFAOapGA"