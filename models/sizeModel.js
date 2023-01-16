const mongoose = require('mongoose');
const schema= mongoose.Schema;

const sizeSchema = new schema({

    size: {
        type: String,
        required: true,
        unique: true  
    },
}, 
{timestamps: true}
) 
   
const sizeModel= mongoose.model('sizeData',sizeSchema);
module.exports = sizeModel;