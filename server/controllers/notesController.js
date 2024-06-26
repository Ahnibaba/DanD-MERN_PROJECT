const Note = require("../models/Note");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");


const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean();
    if(!notes?.length){
       return res.status(400).json({ message: "No notes found" })
    }

    // const notesWithUsers = await Promise.all(notes.map(async (note) => {
    //     const users = await User.find({ _id: { $in: note.user } }).lean().exec();
    //     const usernames = users.map(user => user.username);
        
    //     return { ...note, usernames };
    // }));

    const noteWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec();
        return { ...note, username: user.username }
    }))

    res.json(noteWithUser);
})

const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body;

    if(!user || !title || !text){
        return res.status(400).json({ message: "All fields are required" })
    }

    const duplicate = await Note.findOne({ title }).collation({ locale: "en", strength: 2 }).lean().exec()
    if(duplicate) {
        return res.status(409).json({ message: "Duplicate note title" })
    }
    const noteObject = { user, title, text }
    const note = await Note.create(noteObject);

    if(note){
        res.status(201).json({ message: `Note with the title ${note.title} is created` })
    } else{ 
        res.status(400).json({ message: "Invalid user data received" })
    }
})

const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body

    if(!id || !user || !title || typeof completed !== "boolean") {
        return res.status(400).json({ message: "All fields are required" })
    }

    const note = await Note.findById(id).exec()

    if(!note){
          return res.status(400).json({ message: "Note not found" })
    }

    const duplicate = await Note.findOne({ title }).collation({ locale: "en", strength: 2 }).lean().exec()

    if(duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate note title" })
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()

    res.json(`${updatedNote.title} updated`)
})

const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body
                                       
    if(!id){
        return res.status(400).json({ message: "Note ID required" })
    }

    const note = await Note.findById(id).exec()

    if(!note) {
        return res.status(400).json({message: "Note not found"})
    }

    const result = await note.deleteOne()
    const reply = `Note ${note.title} with ID ${note._id} deleted`
   
   
    res.json(reply)


})

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}