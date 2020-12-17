const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const valueSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique:true
    },
    charge: {
        type: Number,
        required: true
    }
});

var Values = mongoose.model('Value', valueSchema);

module.exports = Values;