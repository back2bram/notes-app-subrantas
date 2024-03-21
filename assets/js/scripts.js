let currentNoteId;

// Elemen kustom untuk catatan
class NoteElement extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", () => this.openEditPopup());
  }

  connectedCallback() {
    const { id, title, body } = this.dataset;
    this.innerHTML = `
      <div class="note" data-id="${id}">
        <h2>${title}</h2>
        <p>${body}</p>
        <div class="edit-buttons">
          <button onclick="editNote('${id}')"><i class="fas fa-edit"></i></button>
          <button onclick="deleteNote('${id}')"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>
    `;
  }
}
customElements.define("note-element", NoteElement);

// Elemen kustom untuk bar aplikasi
class AppBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header>
        <h1>Notes App</h1>
      </header>
    `;
  }
}
customElements.define("app-bar", AppBar);

// Elemen kustom untuk input catatan
class NoteInput extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div>
        <textarea id="noteTitle" name="story" rows="2" cols="33" placeholder="Title"></textarea>
        <textarea id="noteBody" name="story" rows="10" cols="50" placeholder="Note Body"></textarea>
      </div>
      <button onclick="addNote()"><i class="fas fa-plus"></i> Add Note</button>
    `;
  }
}
customElements.define("note-input", NoteInput);

// Data catatan
const notesData = [
  {
    id: "notes-jT-jjsyz61J8XKiI",
    title: "Welcome to Notes, Dimas!",
    body: "Welcome to Notes! This is your first note. You can archive it, delete it, or create new ones.",
    createdAt: "2022-07-28T10:03:12.594Z",
    archived: false,
  },
  {
    id: "notes-aB-cdefg12345",
    title: "Meeting Agenda",
    body: "Discuss project updates and assign tasks for the upcoming week.",
    createdAt: "2022-08-05T15:30:00.000Z",
    archived: false,
  },
  {
    id: "notes-XyZ-789012345",
    title: "Shopping List",
    body: "Milk, eggs, bread, fruits, and vegetables.",
    createdAt: "2022-08-10T08:45:23.120Z",
    archived: false,
  },
  {
    id: "notes-1a-2b3c4d5e6f",
    title: "Personal Goals",
    body: "Read two books per month, exercise three times a week, learn a new language.",
    createdAt: "2022-08-15T18:12:55.789Z",
    archived: false,
  },
  {
    id: "notes-LMN-456789",
    title: "Recipe: Spaghetti Bolognese",
    body: "Ingredients: ground beef, tomatoes, onions, garlic, pasta. Steps:...",
    createdAt: "2022-08-20T12:30:40.200Z",
    archived: false,
  },
  {
    id: "notes-QwErTyUiOp",
    title: "Workout Routine",
    body: "Monday: Cardio, Tuesday: Upper body, Wednesday: Rest, Thursday: Lower body, Friday: Cardio.",
    createdAt: "2022-08-25T09:15:17.890Z",
    archived: false,
  },
  {
    id: "notes-abcdef-987654",
    title: "Book Recommendations",
    body: "1. 'The Alchemist' by Paulo Coelho\n2. '1984' by George Orwell\n3. 'To Kill a Mockingbird' by Harper Lee",
    createdAt: "2022-09-01T14:20:05.321Z",
    archived: false,
  },
  {
    id: "notes-zyxwv-54321",
    title: "Daily Reflections",
    body: "Write down three positive things that happened today and one thing to improve tomorrow.",
    createdAt: "2022-09-07T20:40:30.150Z",
    archived: false,
  },
  {
    id: "notes-poiuyt-987654",
    title: "Travel Bucket List",
    body: "1. Paris, France\n2. Kyoto, Japan\n3. Santorini, Greece\n4. New York City, USA",
    createdAt: "2022-09-15T11:55:44.678Z",
    archived: false,
  },
  {
    id: "notes-asdfgh-123456",
    title: "Coding Projects",
    body: "1. Build a personal website\n2. Create a mobile app\n3. Contribute to an open-source project",
    createdAt: "2022-09-20T17:10:12.987Z",
    archived: false,
  },
  {
    id: "notes-5678-abcd-efgh",
    title: "Project Deadline",
    body: "Complete project tasks by the deadline on October 1st.",
    createdAt: "2022-09-28T14:00:00.000Z",
    archived: false,
  },
  {
    id: "notes-9876-wxyz-1234",
    title: "Health Checkup",
    body: "Schedule a routine health checkup with the doctor.",
    createdAt: "2022-10-05T09:30:45.600Z",
    archived: false,
  },
  {
    id: "notes-qwerty-8765-4321",
    title: "Financial Goals",
    body: "1. Create a monthly budget\n2. Save 20% of income\n3. Invest in a retirement fund.",
    createdAt: "2022-10-12T12:15:30.890Z",
    archived: false,
  },
  {
    id: "notes-98765-54321-12345",
    title: "Holiday Plans",
    body: "Research and plan for the upcoming holiday destination.",
    createdAt: "2022-10-20T16:45:00.000Z",
    archived: false,
  },
  {
    id: "notes-1234-abcd-5678",
    title: "Language Learning",
    body: "Practice Spanish vocabulary for 30 minutes every day.",
    createdAt: "2022-10-28T08:00:20.120Z",
    archived: false,
  },
];

// Mengecek apakah ada data catatan di localStorage
const localStorageNotes = localStorage.getItem("notesData");
if (localStorageNotes) {
  try {
    notesData = JSON.parse(localStorageNotes);
  } catch (error) {
    console.error("Error parsing notes data from localStorage:", error);
  }
}

// Memuat catatan dari localStorage saat aplikasi dimulai
const notesContainer = document.getElementById("notesContainer");
notesData.forEach((note) => {
  const noteElement = document.createElement("note-element");
  noteElement.dataset.id = note.id;
  noteElement.dataset.title = note.title;
  noteElement.dataset.body = note.body;
  notesContainer.appendChild(noteElement);
});

// Fungsi untuk menambahkan catatan baru
function addNote() {
  const noteTitle = document.getElementById("noteTitle").value;
  const noteBody = document.getElementById("noteBody").value;
  if (noteTitle && noteBody) {
    const noteId = "notes-" + Math.random().toString(36).substr(2, 9);
    const noteElement = document.createElement("note-element");
    noteElement.dataset.id = noteId;
    noteElement.dataset.title = noteTitle;
    noteElement.dataset.body = noteBody;
    notesContainer.appendChild(noteElement);
    notesData.push({
      id: noteId,
      title: noteTitle,
      body: noteBody,
    });
    saveDataToLocalStorage();
    document.getElementById("noteTitle").value = "";
    document.getElementById("noteBody").value = "";
  } else {
    // Menggunakan SweetAlert2 untuk menampilkan pesan
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please enter both title and body for the note.",
    });
  }
}

// Fungsi untuk menyimpan data catatan ke localStorage
function saveDataToLocalStorage() {
  localStorage.setItem("notesData", JSON.stringify(notesData));
}

// Fungsi untuk mengedit catatan
function editNote(id) {
  const noteElement = document.querySelector(`.note[data-id="${id}"]`);
  const title = noteElement.querySelector("h2").innerText;
  const body = noteElement.querySelector("p").innerText;
  Swal.fire({
    title: "Edit Note",
    html: `
      <input id="editedTitle" class="swal2-input" value="${title}" placeholder="Title">
      <textarea id="editedBody" class="swal2-textarea" placeholder="Note Body">${body}</textarea>
    `,
    showCancelButton: true,
    confirmButtonText: "Save",
    showLoaderOnConfirm: true,
    preConfirm: () => {
      const editedTitle = document.getElementById("editedTitle").value;
      const editedBody = document.getElementById("editedBody").value;
      if (!editedTitle || !editedBody) {
        Swal.showValidationMessage("Please enter both title and body for the note.");
      }
      return { editedTitle: editedTitle, editedBody: editedBody };
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
      const editedTitle = result.value.editedTitle;
      const editedBody = result.value.editedBody;
      noteElement.querySelector("h2").innerText = editedTitle;
      noteElement.querySelector("p").innerText = editedBody;
      const noteIndex = notesData.findIndex((note) => note.id === id);
      if (noteIndex !== -1) {
        notesData[noteIndex].title = editedTitle;
        notesData[noteIndex].body = editedBody;
        saveDataToLocalStorage();
      }
      Swal.fire({
        icon: "success",
        title: "Note Updated!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}

// Fungsi untuk menghapus catatan
function deleteNote(id) {
  const noteElement = document.querySelector(`.note[data-id="${id}"]`);
  Swal.fire({
    title: "Delete Note",
    text: "Are you sure you want to delete this note?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      noteElement.remove();
      notesData = notesData.filter((note) => note.id !== id);
      saveDataToLocalStorage();
      Swal.fire({
        icon: "success",
        title: "Note Deleted!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}
