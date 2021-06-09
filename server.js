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
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

// route to index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// gets a new note and posts it into the database
app.post("/api/notes", (req, res) => {
    let addNote = req.body;
    let myNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
    let notelength = (myNotes.length).toString(); 
    addNote.id = notelength;

    // pushes data into db.json 
    myNotes.push(addNote);

    //write the updated data to db.json
    fs.writeFileSync("./db/db.json", JSON.stringify(myNotes));
    res.json(myNotes);
})

//delete the note according to their id
app.delete("/api/notes/:id", function (req, res) {
    const db = require("./db/db.json");
    let jsonFilePath = path.join(__dirname, "./db/db.json");
    // for loop to delete note by id 
    for (let i = 0; i < db.length; i++) {

        if (db[i].id == req.params.id) {
            // Splice takes i position, and then deletes the 1 note.
            db.splice(i, 1);
            break;
        }
    }
    // Writes the db.json file
    fs.writeFileSync(jsonFilePath, JSON.stringify(db), function (err) {

        if (err) {
            return console.log(err);
        } else {
            console.log("Your note was deleted!");
        }
    });
    res.json(db);
});


// listen to the port and show which port the server is using 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});