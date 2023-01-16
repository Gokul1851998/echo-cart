const mongoose = require('mongoose');
const schema = mongoose.Schema;

const productSchema = new schema(
    {
    productName: {
        type: String,
        required: true,
    
    },
    category: {
        type: String,
        required: true,
        
    },
    size:{
        type:String,
        require: true 
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
  
    Image: {
        type: Array,
        
    },
    status: {
        type: String,
        default: 'Unblocked'
    },
   
    date: {
        type: Date, 
        default: Date.now
    }
},
{timestamps: true})


const ProductModel= mongoose.model('ProductData', productSchema);
module.exports = ProductModel;  