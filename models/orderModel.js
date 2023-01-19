const mongoose = require('mongoose');
const Objectid = mongoose.Types.ObjectId


const oderSchema = new mongoose.Schema({

    Address : {
        type: Object,
        required: true,
        trim: true
      },
    userId : {
        type: Objectid,
        ref : "UserData",
        required: true,
        trim: true
      }, 
    items : {
       type:[{
                productId: { type:mongoose.Schema.Types.ObjectId, ref: 'ProductData'},
                quantity: {type:Number , default:  1 },
                total : {type: Number},
                
            }],
      },
    paymentMethod : {
        type: String,
        required: true,
        trim: true
      },
   
   
    totalProduct : {
        type: Number,
        required: true,
        trim: true
      },
    totalAmount : {
        type: Number,
        required: true,
        trim: true
      },
      orderStatus : {
        type: String,
        trim: true
      
      },

    
},{ timestamps: true });


module.exports = order = mongoose.model("order", oderSchema)