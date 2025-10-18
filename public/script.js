const gallery = document.getElementById("gallery");
const addForm = document.getElementById("addForm");
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const closeModal = document.getElementById("closeModal");

const fetchImages = async () => {
  const res = await fetch("/api/images");
  const data = await res.json();
  renderGallery(data);
};

const renderGallery = (images) => {
  gallery.innerHTML = "";
  images.forEach((img) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${img.imagePath || "/default.jpg"}" alt="${img.filename}">
      <div class="info">
        <h3>${img.filename}</h3>
        <p>${img.author}</p>
        <p>${new Date(img.uploadDate).toLocaleString()}</p>
      </div>
      <div class="actions">
        <button class="edit" onclick="openEdit('${img._id}', '${img.author}', '${img.filename}')">Редагувати</button>
        <button class="delete" onclick="deleteImage('${img._id}')">Видалити</button>
      </div>
    `;
    gallery.appendChild(card);
  });
};

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(addForm);
  await fetch("/api/images", { method: "POST", body: formData });
  addForm.reset();
  fetchImages();
});

const deleteImage = async (id) => {
  if (!confirm("Видалити зображення?")) return;
  await fetch(`/api/images/${id}`, { method: "DELETE" });
  fetchImages();
};

const openEdit = (id, author, filename) => {
  editForm.id.value = id;
  editForm.author.value = author;
  editForm.filename.value = filename;
  editModal.classList.remove("hidden");
};

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = editForm.id.value;
  const formData = new FormData(editForm);
  await fetch(`/api/images/${id}`, { method: "PUT", body: formData });
  editModal.classList.add("hidden");
  fetchImages();
});

closeModal.addEventListener("click", () => editModal.classList.add("hidden"));

fetchImages();
