const express = require('express');
const mongoose = require('./mongoose.js');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes.js');
const recipesRoutes = require('./routes/recipesRoutes.js');
const authenticateToken = require('./middleware/authenticateToken.js');
const cors = require('cors');



const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: 'http://localhost:5173'
}));

// Middleware
app.use(bodyParser.json());

//routes
app.use('/api', authRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/recipes/add', recipesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})