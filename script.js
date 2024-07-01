// Array para almacenar los turnos reservados
let turnosReservados = [];

// Función para verificar la disponibilidad de un turno
function verificarDisponibilidad(fecha, horario) {
    return !turnosReservados.some(turno => turno.fecha === fecha && turno.horario === horario);
}

// Función para solicitar datos del usuario con validación
function solicitarDato(mensaje, validacion) {
    let dato;
    while (true) {
        dato = prompt(mensaje);
        if (validacion(dato)) break;
        alert("Entrada no válida. Intente de nuevo.");
    }
    return dato;
}

// Función para validar fechas
function validarFecha(fecha) {
    const [dia, mes, año] = fecha.split('-').map(Number);
    const fechaIngresada = new Date(año, mes - 1, dia);
    const hoy = new Date();
    return fechaIngresada >= hoy && /^\d{2}-\d{2}-\d{4}$/.test(fecha);
}

// Clase Turno para encapsular la información de cada turno
class Turno {
    constructor(nombre, fecha, horario) {
        this.nombre = nombre;
        this.fecha = fecha;
        this.horario = horario;
    }
}

// Función para solicitar un turno
function solicitarTurno() {
    let horariosDisponibles = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

    // Selección de fecha
    let fechaElegida = solicitarDato(
        "Ingrese la fecha (DIA-MES-AÑO):",
        validarFecha
    );

    // Selección de horario
    let horarioElegido = solicitarDato(
        `Seleccione un horario:\n 1. 09:00 \n 2. 10:00 \n 3. 11:00 \n 4. 12:00 \n 5. 13:00 \n 6. 14:00 \n 7. 15:00 \n 8. 16:00 \n 9. 17:00`,
        dato => !isNaN(parseInt(dato)) && parseInt(dato) >= 1 && parseInt(dato) <= 9
    );
    let horarioSeleccionado = horariosDisponibles[parseInt(horarioElegido) - 1];

    // Solicitar nombre y apellido
    let nombreCompleto = solicitarDato(
        "Ingrese su nombre y apellido:",
        dato => dato.trim() !== ''
    );

    // Reservar el turno
    if (verificarDisponibilidad(fechaElegida, horarioSeleccionado)) {
        const nuevoTurno = new Turno(nombreCompleto, fechaElegida, horarioSeleccionado);
        turnosReservados.push(nuevoTurno);
        alert(`Turno reservado para ${nombreCompleto} ${fechaElegida} a las ${horarioSeleccionado}.`);
    } else {
        alert("El horario solicitado ya está reservado.");
    }
}

// Función para ver los turnos reservados
function verTurnosReservados() {
    if (turnosReservados.length === 0) {
        alert("No hay turnos reservados.");
    } else {
        let mensaje = "Turnos reservados:\n";
        turnosReservados.forEach(turno => {
            mensaje += `${turno.nombre}, ${turno.fecha}, Hora: ${turno.horario}\n`;
        });
        alert(mensaje);
    }
}

// Menu de opciones
let option;
while (option !== '0') {
    option = prompt("Ingrese una opción:\n1. Solicitar un turno\n2. Ver turnos reservados\n0. Salir");

    switch (option) {
        case '1':
            solicitarTurno();
            break;
        case '2':
            verTurnosReservados();
            break;
        case '0':
            alert("Saliendo del sistema de reservas.");
            break;
        default:
            alert("Opción no válida. Intente de nuevo.");
            break;
    }
}
