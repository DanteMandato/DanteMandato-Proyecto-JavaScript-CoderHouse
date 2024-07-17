const turn_form = document.querySelector('#add-turn');
const turnos_container = document.querySelector('#solicitado');
const clima_container = document.querySelector('#clima-info');
const btnToggleClima = document.createElement('button');
btnToggleClima.id = 'btn-toggle-clima';
btnToggleClima.textContent = 'Mostrar Clima';

// API Key para Weather API
const WEATHER_API_KEY = '2d1853a58c4c41f6ac4212949241707'; // Reemplaza con tu propia API Key de Weather API
const WEATHER_API_URL = 'http://api.weatherapi.com/v1/current.json';

// Obtener la ubicación del usuario y luego obtener el clima
function getWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=${latitude},${longitude}&lang=es`);
                    if (!response.ok) {
                        throw new Error('Error al obtener los datos del clima');
                    }
                    const weatherData = await response.json();
                    displayWeather(weatherData);
                } catch (error) {
                    console.error('Error:', error);
                    clima_container.innerHTML = '<p>Error al obtener los datos del clima</p>';
                }
            },
            (error) => {
                console.error('Error de geolocalización:', error);
                handleGeoLocationError(error);
            },
            {
                timeout: 10000,
                maximumAge: 0,
                enableHighAccuracy: true
            }
        );
    } else {
        clima_container.innerHTML = '<p>Geolocalización no soportada por el navegador</p>';
    }
}

// Mostrar los datos del clima en el DOM
function displayWeather(weatherData) {
    clima_container.innerHTML = `
        <p>Ubicación: ${weatherData.location.name}, ${weatherData.location.country}</p>
        <p>Temperatura: ${weatherData.current.temp_c} °C</p>
        <p>Humedad: ${weatherData.current.humidity}%</p>
        <p>Condición: ${weatherData.current.condition.text}</p>
    `;

    // Agregar botón para eliminar/clima
    btnToggleClima.textContent = 'Eliminar Clima';
    btnToggleClima.addEventListener('click', toggleClima);
    clima_container.appendChild(btnToggleClima);
}

// Manejar errores de geolocalización
function handleGeoLocationError(error) {
    if (error.code === error.TIMEOUT) {
        clima_container.innerHTML = '<p>Se agotó el tiempo de espera para obtener la ubicación</p>';
    } else {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                clima_container.innerHTML = '<p>El usuario denegó la solicitud de geolocalización</p>';
                break;
            case error.POSITION_UNAVAILABLE:
                clima_container.innerHTML = '<p>Información de ubicación no disponible</p>';
                break;
            default:
                clima_container.innerHTML = `<p>Error de geolocalización: ${error.message}</p>`;
                break;
        }
    }
}

// Función para alternar la visibilidad del clima
function toggleClima() {
    if (btnToggleClima.textContent === 'Eliminar Clima') {
        clima_container.innerHTML = '';
        btnToggleClima.textContent = 'Mostrar Clima';
    } else {
        getWeather();
    }
}

// Crear Turno
function createTurn({ nombre, dni, hora, fecha, obraSocial }) {
    const turnos = JSON.parse(localStorage.getItem('turnos')) || [];

    const ids = turnos.map(turno => turno.id);

    const newTurn = {
        id: ids.length > 0 ? Math.max(...ids) + 1 : 0,
        nombre,
        dni,
        hora,
        fecha,
        obraSocial
    };

    turnos.push(newTurn);

    localStorage.setItem('turnos', JSON.stringify(turnos));
    appendTurnos();
    
    // Mostrar alerta de SweetAlert
    Swal.fire({
        title: '¡Turno solicitado!',
        text: 'El turno ha sido solicitado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
}

// Eliminar Turno
function deleteTurn(id) {
    const turnos = JSON.parse(localStorage.getItem('turnos'));
    const newTurnos = turnos.filter(turno => turno.id != id);

    localStorage.setItem('turnos', JSON.stringify(newTurnos));
    appendTurnos();
    
    // Mostrar alerta de Toastify
    Toastify({
        text: 'Turno eliminado con éxito',
        duration: 3000,
        gravity: 'bottom',
        position: 'right',
        backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)'
    }).showToast();
}

// Actualizar Todos en DOM
function appendTurnos() {
    let turnos = JSON.parse(localStorage.getItem('turnos')) || [];

    turnos_container.innerHTML = "";

    turnos.forEach(turno => {
        const turno_container = document.createElement('article');
        turno_container.className = 'turno';
        turno_container.id = `turno-${turno.id}`;

        turno_container.innerHTML = `
            <div>
                <h3>${turno.nombre}</h3>
                <p>DNI: ${turno.dni}</p>
                <p>Hora: ${turno.hora}</p>
                <p>Fecha: ${turno.fecha}</p>
                <p>Obra Social: ${turno.obraSocial}</p>
            </div>
            <button id="btn-delete-${turno.id}" class="btn-delete">Eliminar</button>
        `;

        turnos_container.appendChild(turno_container);

        const deleteButton = document.querySelector(`#btn-delete-${turno.id}`);
        deleteButton.addEventListener('click', (e) => {
            const id = e.target.id.split('-')[2]; 
            deleteTurn(id);
        });
    });
}

appendTurnos();
getWeather();

turn_form.addEventListener('submit', (e) => {
    e.preventDefault();

    const turno = {
        nombre: e.target[0].value,
        dni: e.target[1].value,
        hora: e.target[2].value,
        fecha: e.target[3].value,
        obraSocial: e.target[4].value
    };

    createTurn(turno);

    turn_form.reset();
});
