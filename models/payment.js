const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const paymentSchema = new Schema({
    
    cid: {
        type: String,
        required: true,
        unique: true
    },
    dues: {
        type: Currency,
        default:0
    },
    payments:[
        {   
            pid: {
                type: Number,
                min:0
            },
            paid: {
                 type: Number,
                 min:0,
                 default:0,
                 required:true
            },
            openReading: {
                type: Number,
                min:0,
                required:true
            },
            closeReading: {
                type: Number,
                min:0,
                required:true
            },
            method: {
                type: String,
                required:true
            },
            image: {
                type:String
            },
            date: {
                type: Date,
                default: Date.now
            },
            receiver: {
                type: String,
                required:true
            }
        }, {
            timestamps:{ currentTime: () => Math.floor(Date.now() / 1000) }
        }
    ]

});

var Payments = mongoose.model('Payment', paymentSchema);

module.exports = Payments;