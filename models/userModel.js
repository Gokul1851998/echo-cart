const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   
    userName : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    phone : {
        type: Number,
        required: true
    },
    password : {
        type: String,
        required: true 
    },
 
    status : {
        type: String,
        default: 'Unblocked'
    },
    address:{
        type:Array
    },
    coupon: {
        type: Array,
      },
      applyCoupon: {
        type: Boolean,
        default: false,
      },
      usedCoupon: {
        type: Array,
      },

},{ timestamps: true })

module.exports = UserModel = mongoose.model('UserData',userSchema);