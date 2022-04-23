const fs = require('fs');
const path = require('path');
const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const PORT = process.env.PORT || 3001;
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({extended: true}));
// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));
const { notes } = require('./db/db.json');

function createNewNote(body, notesArray) {
    
    const note = body;
    notesArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({notes: notesArray}, null, 2)
    );

    // return finished code to post route for response
    return note;
}

function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
  }

app.get('/api/notes', (req, res) => {
    res.json(notes);
})

app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
      res.json(result);
  });

app.post('/api/notes', (req, res) => {
    // req.body is where our incoming content will be
    console.log(req.body);
    // set id based on what the next index of the array will be
    req.body.id = notes.length.toString();

    // add new note to json file and notes array in this function
    const note = createNewNote(req.body, notes);
    
    res.json(note);
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.listen(PORT, () => {
    console.log(`API serve now on port ${PORT}`);
})
