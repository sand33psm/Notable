// Variables
let editingNoteIndex = -1

// DOM Element Selections
const menuBtn = document.querySelector('#list-img');
const sidebar = document.querySelector('#sidebar');
const container = document.querySelector('.container');
const noteInput = document.querySelector('.note-input');
const noteTextArea = document.querySelector('.note-textarea');
const noteSubmitBtn = document.querySelector('.note-submit');
const noteCloseBtn = document.querySelector('.note-close');
const notesGrid = document.querySelector('.notes-grid');
const noteCompletionCheckBox = document.querySelector('#completed-notes')

// Helper function to fetch the current date
function fetchDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    return `${year}-${month}-${day}`;
}

// added a theme 

var icon = document.getElementById("icon");

icon.onclick = function(){
    document.body.classList.toggle("dark-theme");
    if(document.body.classList.contains("dark-theme")) {
        icon.src = "images/sun.png";
    }else{
        icon.src = "images/moon.png";
    }
}

// AutoResize textarea
function autoResize(textarea){
    textarea.style.height = 'auto'; //Reset the height
    textarea.style.height = textarea.scrollHeight + 'px'; //Set new height based on scrollHeight
};
// Helper function note input button

function noteInputEnable(){
    noteInput.placeholder = 'Title';
    noteTextArea.style.display = 'block';
    noteSubmitBtn.style.display = 'block';
    noteCloseBtn.style.display = 'block';
}

// Toggle sidebar visibility and adjust container padding
menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    sidebar.classList.toggle('visible');

    if (sidebar.classList.contains('visible')) {
        container.style.padding = '0 60px 0 240px';
    } else {
        container.style.padding = '0 60px 0 60px';
    }
});

// Display note input fields
noteInput.addEventListener('click', () => {  
    // Reset input text 
    // noteSubmitBtn.innerHTML = 'Add Note'

    // Enable note input fields
    noteInputEnable()

    // Close note input fields
    noteCloseBtn.addEventListener('click', () => {
        resetNoteInputFields();
    });
});

// Add a new note
noteSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const inputTitle = noteInput.value.trim();
    const noteText = noteTextArea.value.trim();
    const noteDate = fetchDate();

    if (inputTitle && noteText) {
        // Get notes from localStorage
        let notes = getStoredNotes();

        // Check whether we have to add or edit note
        if (editingNoteIndex === -1){
            // Add new note to the list
            notes.push({
                title: inputTitle,
                text: noteText,
                date: noteDate,
                isCompleted: false,
            });
        } else {
            notes[editingNoteIndex].title = inputTitle
            notes[editingNoteIndex].text = noteText
            notes[editingNoteIndex].date = noteDate

            // Reset the editingNoteIndex to add a note
            editingNoteIndex = -1

            noteSubmitBtn.innerHTML = "Add Note"
        }

        

        // Save notes to localStorage
        localStorage.setItem('notes', JSON.stringify(notes));

        // Update UI with the new note
        displayNotes();

        // Clear input fields
        resetNoteInputFields();
    }
});

// Fetch stored notes from localStorage
function getStoredNotes() {
    const storedNotes = localStorage.getItem('notes');
    return storedNotes ? JSON.parse(storedNotes) : [];
}

// Display notes on the grid
function displayNotes() {
    const allNotes = getStoredNotes();
    var notes
    if (noteCompletionCheckBox.checked) {
        notes = allNotes.filter((note) => {
            return note.isCompleted === true;
        })     

    } else {
        notes = allNotes
    }

    console.log(allNotes);
    console.log(notes);
    
    
 
    notesGrid.innerHTML = ''; // Clear the notes grid before appending

    notes.forEach((note, index) => {
        var checkBtn
        if (note.isCompleted == false){
            checkBtn = `<i class="fa-regular fa-circle-check"></i>`
        } else {
            checkBtn = `<i class="fa-solid fa-circle-check"></i>`
        }

        notesGrid.innerHTML += `
            <div class="note-card" data-index=${index}>
                <h3>${note.title}</h3>
                <p>${note.text}</p>
                <div class="note-footer">
                    <span class="date">${note.date}</span>
                    <div class="icons">
                        <span class="icon note-status">${checkBtn}</span>
                        <span class="icon edit-note"><i class="fas fa-edit"></i></span>
                        <span class="icon delete-note"><i class="fas fa-trash-alt"></i></span>
                    </div>
                </div>
            </div>
        `;
    });


    // Edit a note
    const editNoteBtns = Array.from(document.querySelectorAll('.edit-note'))                

    editNoteBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e)=>{
            // Enable input fields for editing note
            noteInputEnable()

            // Set the note values to form fields to edit.
            noteInput.value = notes[index].title
            noteTextArea.value = notes[index].text

            // Change the Add Note button to Edit Note
            noteSubmitBtn.innerHTML = 'Edit Note'

            // Set the editingNoteIndex to edit a specific note
            editingNoteIndex = index


        })
    })

    // Delete a note

    const noteDeleteBtns = Array.from(document.querySelectorAll('.delete-note'))
    noteDeleteBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e)=>{
            noteToDelete = notes[index]
            notes.splice(index, 1)

            localStorage.setItem('notes', JSON.stringify(notes))
            displayNotes()
        })
    })

    // Note status
    noteStatusBtns = Array.from(document.querySelectorAll('.note-status'))
    noteStatusBtns.forEach((btn, index)=>{
        btn.addEventListener('click', (e)=>{
            if (notes[index].isCompleted == false) {
                console.log("Trueeee");
                
                notes[index].isCompleted = true
                localStorage.setItem('notes', JSON.stringify(notes))
                
            } else {                   
                notes[index].isCompleted = false                    
                localStorage.setItem('notes', JSON.stringify(allNotes))
            }

            displayNotes()

        })
        
    })
            
}

// Show only completed notes
noteCompletionCheckBox.addEventListener('change', (e)=>{
    displayNotes()    
})


// Reset note input fields and hide text area and buttons
function resetNoteInputFields() {
    noteInput.placeholder = 'Add a note';
    noteInput.value = '';
    noteTextArea.value = '';
    noteTextArea.style.display = 'none';
    noteSubmitBtn.style.display = 'none';
    noteCloseBtn.style.display = 'none';    
}

// On page load, display notes
document.addEventListener('DOMContentLoaded', displayNotes);