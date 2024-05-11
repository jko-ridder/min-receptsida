const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/recept', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error Connecting to MongoDB:', error);
});