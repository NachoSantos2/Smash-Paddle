async function cargarDatosJSON() {
    try {
        // Cargar el archivo JSON
        const response = await fetch('datos.json');
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('Error al cargar datos JSON');
        }
        
        // Convertir la respuesta en datos JSON
        const data = await response.json();
        
        // Asignar los datos a variables globales
        reservas = data.reservas;
        catalogoRaquetas = data.catalogoRaquetas;
        
        // Llamar a funciones para trabajar con los datos
        cargarReservasGuardadas(); // Cambiar a cargar reservas guardadas desde datos.json
        mostrarCatalogo(); // Mostrar el catálogo de raquetas
    } catch (error) {
        console.error('Error al cargar datos JSON:', error);
    }
}

// Llamar a la función para cargar los datos JSON al inicio
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
        // Asignar eventos para las celdas de la primera tabla
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
        // Realizar una solicitud para obtener datos del archivo JSON
        const response = await fetch('datos.json');
        const data = await response.json();

        // Verificar si hay datos de reservas en la respuesta
        const reservas = data.reservas || {};

        // Iterar sobre los datos de reservas y actualizar las celdas en la página
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
        // Obtener la celda seleccionada
        let selectedCell = document.querySelector('.selected');

        // Verificar que se haya seleccionado una celda
        if (!selectedCell) {
            Swal.fire({
                icon: 'warning',
                title: 'Por favor, seleccione una celda',
                text: 'Debe seleccionar una celda para reservar un turno.',
            });
            return;
        }

        // Obtener los atributos data de la celda seleccionada
        const dia = selectedCell.getAttribute('data-dia');
        const hora = selectedCell.getAttribute('data-hora');

        // Solicitar el nombre del usuario
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
                            // Actualizar la celda con el nombre
                            selectedCell.textContent = nombre;
                            selectedCell.classList.add('reservado');
                            selectedCell.classList.remove('selected');

                            // Mostrar mensaje de confirmación
                            Swal.fire({
                                icon: 'success',
                                title: 'Reserva exitosa',
                                text: `Turno reservado para ${nombre}.`,
                            });

                            // Guardar la reserva en localStorage
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
    // Obtener reservas existentes de localStorage
    let reservasGuardadas = localStorage.getItem('reservas');
    let reservas = reservasGuardadas ? JSON.parse(reservasGuardadas) : {};

    // Crear o actualizar la reserva para el día y hora específicos
    if (!reservas[dia]) {
        reservas[dia] = {};
    }
    reservas[dia][hora] = { nombre, telefono };

    // Almacenar las reservas actualizadas en localStorage
    localStorage.setItem('reservas', JSON.stringify(reservas));

    console.log('Reserva guardada con éxito en localStorage.');
}

// Cargar reservas guardadas desde localStorage
function cargarReservasGuardadas() {
    // Obtener reservas de localStorage
    const reservasGuardadas = localStorage.getItem('reservas');

    // Verificar si hay datos de reservas guardados en localStorage
    if (reservasGuardadas) {
        const reservas = JSON.parse(reservasGuardadas);

        // Iterar sobre los datos de reservas y actualizar las celdas en la página
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
    // Obtener reservas existentes de localStorage
    let reservasGuardadas = localStorage.getItem('reservas');
    let reservas = reservasGuardadas ? JSON.parse(reservasGuardadas) : {};

    // Verificar si hay reservas para el día y hora especificados
    if (reservas[dia] && reservas[dia][hora]) {
        // Eliminar la reserva específica
        delete reservas[dia][hora];

        // Si ya no hay reservas para el día, eliminar el objeto del día
        if (Object.keys(reservas[dia]).length === 0) {
            delete reservas[dia];
        }

        // Actualizar localStorage con las reservas modificadas
        localStorage.setItem('reservas', JSON.stringify(reservas));
    }
}

//eliminarReservaEnLocalStorage('Lunes','19:00')


async function cargarDatos() {
    try {
        // Cargar datos de datos.json
        const response = await fetch('datos.json');
        if (!response.ok) {
            throw new Error('Error al cargar datos JSON');
        }
        const data = await response.json();
        const reservasJSON = data.reservas || {};

        // Cargar datos de localStorage
        const reservasLocalStorageString = localStorage.getItem('reservas');
        const reservasLocalStorage = reservasLocalStorageString ? JSON.parse(reservasLocalStorageString) : {};

        // Combinar las reservas de JSON y localStorage con prioridad para las de localStorage
        const reservasCombinadas = { ...reservasJSON };

        // Sobreescribir reservas de JSON con las de localStorage para priorizar las más recientes
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

        // Iterar sobre las reservas combinadas y actualizar la página
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

// Llama a la función para cargar los datos al inicio
cargarDatos();