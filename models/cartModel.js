const mongoose = require('mongoose');
const schema= mongoose.Schema;
 
const cartSchema = new schema({ 
    userId: {
        type:mongoose.Schema.Types.ObjectId, 
        required: true,
        ref:'userData'
       }, 
    
       products: {
        type:[{
                productId: { type:mongoose.Schema.Types.ObjectId, ref: 'ProductData'},
                quantity: {type:Number , default:  1 },
                total : {type: Number},
                
            }],
        },
        cartTotal : {
            type: Number,
            default: 0                
        },
        discount : {
            type: Number,
            default: 0
        }
})

   
const cartModel= mongoose.model('CartData',cartSchema);
module.exports = cartModel;  