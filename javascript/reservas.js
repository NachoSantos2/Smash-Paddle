async function cargarDatosJSON() {
    try {
        
        const response = await fetch('datos.json');
        
        if (!response.ok) {
            throw new Error('Error al cargar datos JSON');
        }
    
        const data = await response.json();
        
        reservas = data.reservas;
        catalogoRaquetas = data.catalogoRaquetas;
        
        cargarReservasGuardadas(); 
        mostrarCatalogo(); 
    } catch (error) {
        console.error('Error al cargar datos JSON:', error);
    }
}

cargarDatosJSON();

document.addEventListener('DOMContentLoaded', function () {
    // Función para cambiar la selección de horarios
    function toggleSeleccion() {
        try {
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
            } else {
                document.querySelectorAll('.horario.selected').forEach(function (selectedHorario) {
                    selectedHorario.classList.remove('selected');
                });
                this.classList.add('selected');
            }
        } catch (error) {
            console.error('Error al cambiar la selección de horarios:', error);
        }
    }

    try {
        
        document.querySelectorAll('#turnos .horario').forEach(function (horario) {
            horario.addEventListener('click', toggleSeleccion);
        });

        // Asignar eventos para las celdas de la segunda tabla
        document.querySelectorAll('.titulo-proxima-semana + table .horario').forEach(function (horario) {
            horario.addEventListener('click', toggleSeleccion);
        });

        // Asignar eventos de los botones de reserva
        const btnReservar = document.querySelectorAll('#turnos #btnReservar, .titulo-proxima-semana + table #btnReservar');
        btnReservar.forEach(function (btn) {
            btn.addEventListener('click', reservarTurno);
        });

        // Cargar reservas guardadas desde datos.json
        cargarReservasGuardadas();
    } catch (error) {
        console.error('Error al inicializar los eventos:', error);
    }
});

// Función asincrónica para cargar reservas guardadas desde el archivo JSON
async function cargarReservasGuardadas() {
    try {
        
        const response = await fetch('datos.json');
        const data = await response.json();

       
        const reservas = data.reservas || {};

        
        for (let dia in reservas) {
            for (let hora in reservas[dia]) {
                let celda = document.querySelector(`.horario[data-dia="${dia}"][data-hora="${hora}"]`);
                if (celda) {
                    let reserva = reservas[dia][hora];
                    celda.textContent = reserva.nombre;
                    celda.classList.add('reservado');
                }
            }
        }
    } catch (error) {
        console.error('Error al cargar reservas guardadas desde datos.json:', error);
    }
}

async function reservarTurno() {
    try {
        
        let selectedCell = document.querySelector('.selected');

        
        if (!selectedCell) {
            Swal.fire({
                icon: 'warning',
                title: 'Por favor, seleccione una celda',
                text: 'Debe seleccionar una celda para reservar un turno.',
            });
            return;
        }

        
        const dia = selectedCell.getAttribute('data-dia');
        const hora = selectedCell.getAttribute('data-hora');

        
        Swal.fire({
            title: 'Ingrese su nombre',
            input: 'text',
            inputPlaceholder: 'Nombre',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            allowOutsideClick: false,
        }).then(async (result) => {
            if (result.isConfirmed) {
                let nombre = result.value;

                // Solicitar el número de teléfono del usuario
                Swal.fire({
                    title: 'Ingrese su número de teléfono',
                    input: 'tel',
                    inputPlaceholder: 'Número de teléfono',
                    showCancelButton: true,
                    confirmButtonText: 'Confirmar',
                    cancelButtonText: 'Cancelar',
                    allowOutsideClick: false,
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        let telefono = result.value;

                        if (nombre && telefono) {
                            
                            selectedCell.textContent = nombre;
                            selectedCell.classList.add('reservado');
                            selectedCell.classList.remove('selected');

                            
                            Swal.fire({
                                icon: 'success',
                                title: 'Reserva exitosa',
                                text: `Turno reservado para ${nombre}.`,
                            });

                            
                            await guardarReservaEnLocalStorage(dia, hora, nombre, telefono);
                        } else {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Datos incompletos',
                                text: 'Por favor, complete su nombre y teléfono.',
                            });
                        }
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error al reservar un turno:', error);
    }
}



// Guardar reserva en localStorage
async function guardarReservaEnLocalStorage(dia, hora, nombre, telefono) {
    let reservasGuardadas = localStorage.getItem('reservas');
    let reservas = reservasGuardadas ? JSON.parse(reservasGuardadas) : {};


    if (!reservas[dia]) {
        reservas[dia] = {};
    }
    reservas[dia][hora] = { nombre, telefono };

    localStorage.setItem('reservas', JSON.stringify(reservas));

    console.log('Reserva guardada con éxito en localStorage.');
}

// Cargar reservas guardadas desde localStorage
function cargarReservasGuardadas() {
    const reservasGuardadas = localStorage.getItem('reservas');

    if (reservasGuardadas) {
        const reservas = JSON.parse(reservasGuardadas);

        for (let dia in reservas) {
            for (let hora in reservas[dia]) {
                let celda = document.querySelector(`.horario[data-dia="${dia}"][data-hora="${hora}"]`);
                if (celda) {
                    let reserva = reservas[dia][hora];
                    celda.textContent = reserva.nombre;
                    celda.classList.add('reservado');
                }
            }
        }
    }
}

// Eliminar reserva en localStorage
function eliminarReservaEnLocalStorage(dia, hora) {
    let reservasGuardadas = localStorage.getItem('reservas');
    let reservas = reservasGuardadas ? JSON.parse(reservasGuardadas) : {};

    if (reservas[dia] && reservas[dia][hora]) {
 
        delete reservas[dia][hora];

        if (Object.keys(reservas[dia]).length === 0) {
            delete reservas[dia];
        }

        localStorage.setItem('reservas', JSON.stringify(reservas));
    }
}

async function cargarDatos() {
    try {
       
        const response = await fetch('datos.json');
        if (!response.ok) {
            throw new Error('Error al cargar datos JSON');
        }
        const data = await response.json();
        const reservasJSON = data.reservas || {};

        
        const reservasLocalStorageString = localStorage.getItem('reservas');
        const reservasLocalStorage = reservasLocalStorageString ? JSON.parse(reservasLocalStorageString) : {};

        const reservasCombinadas = { ...reservasJSON };

        for (const dia in reservasLocalStorage) {
            if (reservasLocalStorage.hasOwnProperty(dia)) {
                if (!reservasCombinadas[dia]) {
                    reservasCombinadas[dia] = {};
                }
                for (const hora in reservasLocalStorage[dia]) {
                    reservasCombinadas[dia][hora] = reservasLocalStorage[dia][hora];
                }
            }
        }

        for (const dia in reservasCombinadas) {
            for (const hora in reservasCombinadas[dia]) {
                const reserva = reservasCombinadas[dia][hora];
                const celda = document.querySelector(`.horario[data-dia="${dia}"][data-hora="${hora}"]`);
                if (celda) {
                    celda.textContent = reserva.nombre;
                    celda.classList.add('reservado');
                }
            }
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}


cargarDatos();