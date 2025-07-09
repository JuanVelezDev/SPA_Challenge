// Elementos del DOM
const form = document.getElementById('studentForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const enrollInput = document.getElementById('enrollNumber');
const dateInput = document.getElementById('dateOfAdmission');
const idInput = document.getElementById('studentId');
const table = document.getElementById('studentTable');
const tableBody = document.querySelector('#studentTable tbody');
const addButton = document.querySelector('header button');

let editingId = null;

// Mostrar solo la tabla
function showTable() {
  table.style.display = 'table';
  form.style.display = 'none';
  addButton.style.display = 'inline-block';
}

// Mostrar solo el formulario
function showForm(student = null) {
  form.style.display = 'block';
  table.style.display = 'none';
  addButton.style.display = 'none';
  if (student) {
    nameInput.value = student.name;
    emailInput.value = student.email;
    phoneInput.value = student.phone;
    enrollInput.value = student.enrollNumber;
    dateInput.value = student.dateOfAdmission;
    idInput.value = student.id;
    editingId = student.id;
  } else {
    form.reset();
    idInput.value = '';
    editingId = null;
  }
}

// Ocultar formulario y mostrar tabla
function hideForm() {
  form.reset();
  editingId = null;
  showTable();
}

// Obtener y mostrar estudiantes
async function fetchStudents() {
  const res = await fetch('http://localhost:3000/users');
  const students = await res.json();
  renderTable(students);
}

// Renderizar estudiantes en la tabla
function renderTable(students) {
  tableBody.innerHTML = '';
  students.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.email}</td>
      <td>${student.phone}</td>
      <td>${student.enrollNumber}</td>
      <td>${student.dateOfAdmission}</td>
      <td>
        <button onclick='editStudent(${JSON.stringify(student)})'>Editar</button>
        <button onclick='deleteStudent(${JSON.stringify(student.id)})'>Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Editar estudiante (rellenar formulario)
window.editStudent = function(student) {
  showForm(student);
};

// Eliminar estudiante (confirmar y eliminar)
window.deleteStudent = async function(id) {
  if (confirm('¿Seguro que deseas eliminar este estudiante?')) {
    await fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE' });
    fetchStudents();
  }
};

// Crear o actualizar estudiante
form.onsubmit = async function(e) {
  e.preventDefault();
  const student = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    enrollNumber: enrollInput.value.trim(),
    dateOfAdmission: dateInput.value.trim()
  };
  if (editingId) {
    await fetch(`http://localhost:3000/users/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
  } else {
    await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
  }
  hideForm();
  fetchStudents();
};

// Función para navegar entre vistas
function navigateTo(view) {
  let main = document.querySelector('main.contenido');
  if (view === 'estudiantes') {
    main.innerHTML = `<h2>Reporte de Estudiantes</h2><p>Contenido del reporte de estudiantes...</p>`;
  } else if (view === 'cursos') {
    main.innerHTML = `<h2>Reporte de Cursos</h2><p>Contenido del reporte de cursos...</p>`;
  } else if (view === 'pagos') {
    main.innerHTML = `<h2>Reporte de Pagos</h2><p>Contenido del reporte de pagos...</p>`;
  }
}

// Inicializar SPA
addButton.onclick = () => showForm();
form.querySelector('button[type="button"]').onclick = hideForm;

showTable();
fetchStudents();
window.showForm = showForm;
window.hideForm = hideForm;