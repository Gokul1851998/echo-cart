
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const couponSchema = new mongoose.Schema({
    userId: {
        type: String,
    
    },
    couponName:{
        type:String,
        required:true
    },
    couponId:{
        type:String,
        unique: true,
        required:true
    },
    couponDiscount:{
        type:Number,
        required:true
    },
    couponExpiredDate:{
        type:Date,
        required:true 
    },
    Amount:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('coupon',couponSchema)
