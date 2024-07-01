const turn_form = document.querySelector('#add-turn');
const turnos_container = document.querySelector('#solicitado');

// Crear nuevo turno

function createTurn({ nombre, hora, fecha }) {
const turnos = JSON.parse(localStorage.getItem('turnos')) || [];

const ids = turnos.map(turno => turno.id);

const newTurn = {
    id: ids.length > 0 ? Math.max(...ids) + 1 : 0,
    nombre,
    hora,
    fecha
};

turnos.push(newTurn);

localStorage.setItem('turnos', JSON.stringify(turnos));
appendTurnos();
}

// Cancelar los turnos solicitados

function deleteTurn(id) {
const turnos = JSON.parse(localStorage.getItem('turnos'));
const newTurnos = turnos.filter(turno => turno.id != id);

localStorage.setItem('turnos', JSON.stringify(newTurnos));
appendTurnos();
}

// Actualizar los turnos en Dom

function appendTurnos() {
const turnos = JSON.parse(localStorage.getItem('turnos')) || [];

turnos_container.innerHTML = "";

turnos.forEach(turno => {
    const turno_container = document.createElement('article');
    turno_container.className = 'turno';
    turno_container.id = `turno-${turno.id}`;

    turno_container.innerHTML = `
    <div>
        <h3>${turno.nombre}</h3>
        <p>Hora: ${turno.hora}</p>
        <p>Fecha: ${turno.fecha}</p>
    </div>
    <button id="btn-${turno.id}" class="btn-delete">Cancelar turno</button>
    `;

    turnos_container.appendChild(turno_container);

    const deleteButton = document.querySelector(`#btn-${turno.id}`);
    deleteButton.addEventListener('click', (e) => {
    const id = e.target.id.split('-')[1];
    deleteTurn(id);
    Toastify({
        text: "Turno cancelado",
        className: "deleted-turn",
        style: {
        background: 'crimson',
        padding: '32px',
        width: '500px',
        textAlign: "center"
        },
        duration: 1000,
        gravity: 'bottom'
    }).showToast();
    });
});
}

appendTurnos();

turn_form.addEventListener('submit', (e) => {
e.preventDefault();

const turno = {
    nombre: e.target[0].value,
    hora: e.target[1].value,
    fecha: e.target[2].value
};

createTurn(turno);
Swal.fire({
    title: '¡Turno solicitado!',
    icon: 'success',
    confirmButtonText: 'Terminar'
});

turn_form.reset();
});
