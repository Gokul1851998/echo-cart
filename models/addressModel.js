const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
   
    userId : {
        type: String,
        required: true 
    },
    firstName: {
        type: String,
        required: true,
    
    },
    lastName: {
        type: String,
        required: true,
    
    },
    mobNumber : {
        type: Number,
        required: true
    },
    email : {
        type: String,
        required: true 
    },
 
    homeaddress : {
        type: String,
        require: true
    },
    city:{
        type: String
    },
    state:{
        type: String
    },
    country:{
        type: String
    }

})

module.exports = addressModel = mongoose.model('addressData',addressSchema);