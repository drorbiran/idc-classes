var mongoose = require("mongoose");

// SCHEMA SETUP
var courseSchema = new mongoose.Schema({
    name: String,
    image: String,
    lecturer: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Course", courseSchema);