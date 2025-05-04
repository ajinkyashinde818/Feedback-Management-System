require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const Feedback = require('./models/Feedback');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get feedbacks
app.get('/api/feedbacks', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ date: -1 });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).send("Error fetching feedbacks.");
    }
});

// Post feedback
app.post('/api/feedbacks', async (req, res) => {
    const { name, message } = req.body;
    if (!name || !message) return res.status(400).send("All fields required.");

    try {
        const feedback = new Feedback({ name, message });
        await feedback.save();
        res.status(201).send("Feedback submitted.");
    } catch (err) {
        res.status(500).send("Error saving feedback.");
    }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

