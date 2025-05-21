// Required Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb+srv://abhijeetas8660211:Ap5gHhbBgBIiCWeH@cluster0.lsitr.mongodb.net/persondb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define Schema and Model
const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    mobile: String
});

const Person = mongoose.model('Person', personSchema);

// ROUTES

// GET /person: List of people
app.get('/person', async (req, res) => {
    const people = await Person.find();
    res.render('index', { people });
});

// GET /person/new: Form to create a person
app.get('/person/new', (req, res) => {
    res.render('new');
});

// POST /person: Create a new person
app.post('/person', async (req, res) => {
    await Person.create(req.body);
    res.redirect('/person');
});

// GET /person/:id/edit: Form to edit person
app.get('/person/:id/edit', async (req, res) => {
    const person = await Person.findById(req.params.id);
    res.render('edit', { person });
});

// PUT /person/:id: Update a person
app.put('/person/:id', async (req, res) => {
    await Person.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/person');
});

// DELETE /person/:id: Delete a person
app.delete('/person/:id', async (req, res) => {
    await Person.findByIdAndDelete(req.params.id);
    res.redirect('/person');
});

// Start Server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
