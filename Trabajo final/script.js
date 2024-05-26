let turnosReservados = [];

function verificarDisponibilidad(fecha, horario) {
    for (let turno of turnosReservados) {
        if (turno.fecha === fecha && turno.horario === horario) {
            return false;
        }
    }
    return true;
}

function solicitarTurno() {
    let horariosDisponibles = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

    let horarioElegido, fechaElegida, nombreCompleto;

    // Selección de fecha
    while (true) {
        fechaElegida = prompt("Ingrese la fecha (DIA-MES-AÑO):");
        if (/^\d{2}-\d{2}-\d{4}$/.test(fechaElegida)) break;
        alert("Formato de fecha no válido. Intente de nuevo.");
    }

    // Selección de horario
    while (true) {
        horarioElegido = prompt(`Seleccione un horario:\n 1. 09:00 \n 2. 10:00 \n 3. 11:00 \n 4. 12:00 \n 5. 13:00 \n 6. 14:00 \n 7. 15:00 \n 8. 16:00 \n 9. 17:00`);
        horarioElegido = parseInt(horarioElegido);
        if (horarioElegido >= 1 && horarioElegido <= 9) break;
        alert("Opción no válida. Intente de nuevo.");
    }
    let horarioSeleccionado = horariosDisponibles[horarioElegido - 1];

    // Solicitar nombre y apellido
    while (true) {
        nombreCompleto = prompt("Ingrese su nombre y apellido:");
        if (nombreCompleto !== '') break;
        alert("El nombre no puede estar vacío. Intente de nuevo.");
    }

    // Reservar el turno
    if (verificarDisponibilidad(fechaElegida, horarioSeleccionado)) {
        turnosReservados.push({ nombre: nombreCompleto, fecha: fechaElegida, horario: horarioSeleccionado });
        alert(`Turno reservado para ${nombreCompleto} el ${fechaElegida} a las ${horarioSeleccionado}.`);
    } else {
        alert("El horario solicitado ya está reservado.");
    }
}

function verTurnosReservados() {
    if (turnosReservados.length === 0) {
        alert("No hay turnos reservados.");
    } else {
        let mensaje = "Turnos reservados:\n";
        for (let turno of turnosReservados) {
            mensaje += `${turno.nombre} - Fecha: ${turno.fecha}, Hora: ${turno.horario}\n`;
        }
        alert(mensaje);
    }
}

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