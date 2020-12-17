const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const feedbackSchema = new Schema({
    
    cid: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

var Feedbacks = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedbacks;