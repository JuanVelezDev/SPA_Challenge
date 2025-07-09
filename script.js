const API_URL = 'http://localhost:3000/users';

let students = [];

// Obtener referencias a los elementos del DOM
const form = document.getElementById('studentForm');
const tableBody = document.querySelector('#studentTable tbody');
const addButton = document.querySelector('header button');

// Mostrar el formulario para agregar/editar estudiante
window.showForm = async function(id = null) {
  if (location.hash !== "#inicio") location.hash = "#inicio";
  form.style.display = '';
  if (id !== null) {
    // Editar: obtener datos del estudiante
    const student = students.find(s => s.id == id);
    if (student) {
      document.getElementById('studentId').value = student.id;
      document.getElementById('name').value = student.name;
      document.getElementById('email').value = student.email;
      document.getElementById('phone').value = student.phone;
      document.getElementById('enrollNumber').value = student.enrollNumber;
      document.getElementById('dateOfAdmission').value = student.dateOfAdmission;
    }
  } else {
    document.getElementById('studentId').value = '';
    form.reset();
  }
};

// Ocultar el formulario
window.hideForm = function() {
  form.style.display = 'none';
  form.reset();
};

// Renderizar la tabla de estudiantes
function renderTable() {
  tableBody.innerHTML = '';
  students.forEach(student => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${student.name}</td>
      <td>${student.email}</td>
      <td>${student.phone}</td>
      <td>${student.enrollNumber}</td>
      <td>${student.dateOfAdmission}</td>
      <td>
        <button onclick="showForm('${student.id}')">Editar</button>
        <button onclick="deleteStudent('${student.id}')">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// Cargar estudiantes desde la API
async function fetchStudents() {
  const res = await fetch(API_URL);
  students = await res.json();
  renderTable();
}

// Guardar estudiante (agregar o editar)
form.onsubmit = async function(e) {
  e.preventDefault();
  const id = document.getElementById('studentId').value;
  const student = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    enrollNumber: document.getElementById('enrollNumber').value,
    dateOfAdmission: document.getElementById('dateOfAdmission').value
  };

  if (id) {
    // Editar
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
  } else {
    // Agregar
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
  }
  hideForm();
  fetchStudents();
};

// Eliminar estudiante
window.deleteStudent = async function(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchStudents();
};

// Mostrar formulario solo si estamos en #inicio
window.addEventListener('hashchange', () => {
  if (location.hash !== "#inicio") hideForm();
});

// Botón para agregar estudiante
addButton.onclick = () => showForm();

// Inicializar tabla al cargar
fetchStudents();


const routes = {
  "/login": "login.html",
  "/cursos": "cursos.html",
  "/usuarios": "usuarios.html",
  "/reportes": "reportes.html",
  "/estudiantes": "estudiantes.html",
  "/pagos": "pagos.html"
}



function isAuth() { 
  const result = localStorage.getItem('isAuth') || null 
    return result
}

if (!localStorage.getItem('isAuth')) {
  window.location.href = 'login.html';
}

document.querySelector('.logout').onclick = function() {
  localStorage.removeItem('isAuth');
  window.location.href = 'login.html';
};

