const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Contact = new Schema({
    id: {
      type: String,
      required:true
    },
    firstname: {
      type: String,
        default: '',
        required: true
    },
    lastname: {
      type: String,
        default: '',
        required:true
    },
    phone: {
        type: Number,
        default: '',
        required:true
    },
    address: {
        type: String,
        default: '',
        required:true
    },
    zip: {
        type: Number,
        default: '',
        required:true
    }
});

module.exports = mongoose.model('Contact',Contact);