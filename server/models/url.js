const mongoose = require('mongoose');
const urlSchema = new mongoose.Schema(
    {
        "url": String,
        "short": String,
    }, 
    {
        timestamps: true // createdAt, updatedAt
    }
);

const urlModel = mongoose.model('URL', urlSchema);

export default urlModel;