const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const dataRoutes = require("./routes/dataRoutes");

app.use(express.json());

// Connect to MongoDB
db.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log('Server Listening on Port ' + PORT);
    });
})
.catch((err) => {
    console.log(err);
});

// Routes
app.use('/auth', authRoutes);
app.use('/data', dataRoutes);