//dependencies
const fs = require("fs");
const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3001;

// Sets up the Express App
const app = express();

// serves everything inside the public folder
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//route to notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// route to index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

//route to read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

//receive a new note to save on the request body, add it to the `db.json` file, 
//and then return the new note to the client.
app.post("/api/notes", (req, res) => {
    let addNote = req.body;
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
    let notelength = (noteList.length).toString();

    //create new property called id based on length and assign it to each json object
    addNote.id = notelength;

    //push updated note to the data containing notes history in db.json
    noteList.push(addNote);

    //write the updated data to db.json
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
})

//delete note according to their id.
app.delete("/api/notes/:id", (req, res) => {
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
    let noteId = (req.params.id).toString();

    //filter all notes that does not have matching id and saved them as a new array
    //the matching array will be deleted
    noteList = noteList.filter(selected =>{
        return selected.id != noteId;
    })

    //write the updated data to db.json and display the updated note
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
});


// listen to the port and show which port the server is using 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});