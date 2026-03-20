const mongoose = require('mongoose');
const schema = mongoose.Schema;

const listingSchema = new schema({
    title:{
        type: String,
        required: true,
    },
    description:String,
    image:{
        type:String,
        default:"https://images.pexels.com/photos/635279/pexels-photo-635279.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
        set:(v)=>
            v==="https://images.pexels.com/photos/635279/pexels-photo-635279.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"?"default link":v,
    },
    price:Number,
    location:String,
    country:String,
});

const listingModel = mongoose.model("listings", listingSchema);
module.exports = listingModel;