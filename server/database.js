const mongoose = require('mongoose');
require('dotenv').config()

async function connectDB() {
    await mongoose.connect(process.env.MONGODB_KEY);
}
function lookUp(obj) {
    // look up the url then return if found
    
}

export default {};