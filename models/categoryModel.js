const mongoose = require('mongoose');
const schema= mongoose.Schema;

const categorySchema = new schema({
 
    category: {
        type: String, 
        required: true, 
        unique: true  
    },
}, 
{timestamps: true}
) 
   
const categoryModel= mongoose.model('CategoryData',categorySchema);
module.exports = categoryModel;