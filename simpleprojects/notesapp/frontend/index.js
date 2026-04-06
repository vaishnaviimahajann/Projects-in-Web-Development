const titleInput = document.querySelector("input");
const descInput = document.querySelector("textarea");
const addBtn = document.querySelector(".save-btn");
const notesContainer = document.getElementById("notesContainer");

let notes=[];
 addBtn.addEventListener("click",()=>{
  const title=titleInput.value;
  const desc=descInput.value;

  if(title && desc =="") return;

  const note={
    id:Date.now(),
    title,
    desc
  };

  notes.push(note);
  renderNotes();

  titleInput.value="";
  descInput.value="";
 });


// RENDER NOTES
function renderNotes() {
  notesContainer.innerHTML = "";

  notes.forEach(note => {

    const div = document.createElement("div");
    div.className = "noteBox";

    div.innerHTML = `
      <div class="noteTitle"><b>Title:</b> ${note.title}</div>
      <div class="noteDesc"><b>Description:</b><br>${note.desc}</div>

      <div class="noteActions">
        <button class="editBtn" data-id="${note.id}">Edit</button>
        <button class="deleteBtn" data-id="${note.id}">Delete</button>
      </div>
    `;

    notesContainer.appendChild(div);
  });
}