// DOM Element Selections
const menuBtn = document.querySelector('#list-img');
const sidebar = document.querySelector('#sidebar');
const container = document.querySelector('.container');
const noteInput = document.querySelector('.note-input');
const noteTextArea = document.querySelector('.note-textarea');
const noteSubmitBtn = document.querySelector('.note-submit');
const noteCloseBtn = document.querySelector('.note-close');
const notesGrid = document.querySelector('.notes-grid');

// Helper function to fetch the current date
function fetchDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    return `${year}-${month}-${day}`;
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
    noteInput.placeholder = 'Title';
    noteTextArea.style.display = 'block';
    noteSubmitBtn.style.display = 'block';
    noteCloseBtn.style.display = 'block';

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
        let notes = getStoredNotes();

        // Add new note to the list
        notes.push({
            title: inputTitle,
            text: noteText,
            date: noteDate,
        });

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
    const notes = getStoredNotes();
    notesGrid.innerHTML = ''; // Clear the notes grid before appending

    notes.forEach((note) => {
        notesGrid.innerHTML += `
            <div class="note-card">
                <h3>${note.title}</h3>
                <p>${note.text}</p>
                <div class="note-footer">
                    <span class="date">${note.date}</span>
                    <div class="icons">
                        <span class="icon">🗹</span>
                        <span class="icon">✎</span>
                        <span class="icon">🗑</span>
                    </div>
                </div>
            </div>
        `;
    });
}

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