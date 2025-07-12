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
      <td>
        <img class= img-student src="./img/Profile.jpg" alt="Foto" style="width:55px;height:40px;border:50%;vertical-align:middle;margin-right:8px;">
        ${student.name}
      </td>
      <td>${student.email}</td>
      <td>${student.phone}</td>
      <td>${student.enrollNumber}</td>
      <td>${student.dateOfAdmission}</td>
      <td>
        <button onclick="showForm('${student.id}')">
          <svg class="icn-editar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 19"><path d="M18.303 2.088 16.911.696A2.37 2.37 0 0 0 15.232 0c-.608 0-1.216.232-1.68.695L.476 13.772l-.471 4.239a.89.89 0 0 0 .983.983l4.235-.468 13.08-13.08a2.374 2.374 0 0 0 0-3.358M4.678 17.392l-3.452.383.384-3.457 9.793-9.793 3.072 3.071zM17.464 4.607l-2.15 2.15-3.071-3.072 2.15-2.15a1.18 1.18 0 0 1 .84-.347c.316 0 .614.123.839.347l1.392 1.392a1.19 1.19 0 0 1 0 1.68" fill="#currentColor"/></svg>
        </button>
        <button onclick="deleteStudent('${student.id}')">
          <svg class= "icn-eliminar" viewBox="0 0 16 18" xmlns="http://www.w3.org/2000/svg"><path d="M.286 2.25H4L5.2.675A1.74 1.74 0 0 1 6.57 0h2.86c.266 0 .528.061.766.178s.445.287.605.497L12 2.25h3.714a.3.3 0 0 1 .202.082.28.28 0 0 1 .084.2v.562a.28.28 0 0 1-.084.199.3.3 0 0 1-.202.082h-.675l-1.185 13.089c-.039.42-.235.81-.551 1.094a1.73 1.73 0 0 1-1.157.442H3.854a1.73 1.73 0 0 1-1.157-.442 1.68 1.68 0 0 1-.55-1.094L.96 3.375H.286a.3.3 0 0 1-.202-.082.28.28 0 0 1-.084-.2v-.562a.28.28 0 0 1 .084-.199.3.3 0 0 1 .202-.082m9.6-.9a.57.57 0 0 0-.457-.225H6.57a.58.58 0 0 0-.457.225l-.685.9h5.142zm-6.6 15.012c.011.14.076.27.182.366a.57.57 0 0 0 .386.147h8.292a.57.57 0 0 0 .386-.147.56.56 0 0 0 .182-.366l1.179-12.987H2.107z" fill="#currentColor"/></svg>
        </button>
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
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
  } else {
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

// --- SPA Navigation ---
function navigate(hash) {
  document.querySelectorAll('.spa-section').forEach(sec => sec.style.display = 'none');
  const section = document.querySelector(hash);
  if (section) section.style.display = '';
}

// Enlaza los menús a navigate
document.querySelectorAll('.menu a').forEach(link => {
  link.onclick = function(e) {
    e.preventDefault();
    navigate(this.getAttribute('href'));
    window.location.hash = this.getAttribute('href');
  };
});

// Inicializa la vista correcta al cargar
window.addEventListener('DOMContentLoaded', () => {
  navigate(window.location.hash || '#inicio');
});
window.addEventListener('hashchange', () => {
  navigate(window.location.hash || '#inicio');
  if (location.hash !== "#inicio") hideForm();
});

// Botón para agregar estudiante
addButton.onclick = () => showForm();

// Inicializar tabla al cargar
fetchStudents();

// --- Autenticación básica ---
function isAuth() { 
  return localStorage.getItem('isAuth') || null;
}
if (!isAuth()) {
  window.location.href = 'login.html';
}
document.querySelector('.logout').parentElement.onclick = function() {
  localStorage.removeItem('isAuth');
  window.location.href = 'login.html';
};  



