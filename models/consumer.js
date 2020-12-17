const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Consumer = new Schema({
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
    reading : {
        type: Number,
        required:true
    },
    doi:{
        type: String,
        required:true
    },
    phone: {
        type: String,
        default: '',
        required:true
    },
    address: {
        type: String,
        default: '',
        required:true
    },
    district: {
        type: String,
        default: '',
        required:true
    },
    city: {
        type: String,
        default: '',
        required:true
    },
    state: {
        type: String,
        default: '',
        required:true
    }
});

module.exports = mongoose.model('Consumer',Consumer);