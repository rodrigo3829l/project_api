import mongoose from "mongoose";

const {Schema, model} = mongoose;

const aromaSchema = new Schema({
    aroma:{
        type: String,
        require: true,
        trim: true,
        index: {unique : true}
    }
});

export const Aroma = model('Aroma', aromaSchema);