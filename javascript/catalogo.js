// Array de raquetas
let raquetas = [
    { id: 1, marca: 'PaddleMaster', tipo: 'Profesional', precio: 129.99 },
    { id: 2, marca: 'SmashTech', tipo: 'Recreativa', precio: 59.99 },
    { id: 3, marca: 'SpeedyPaddle', tipo: 'Principiante', precio: 39.99 },
];

let carrito = [];

// Función para mostrar el catálogo de raquetas
function mostrarCatalogo() {
    let catalogoDiv = document.getElementById('catalogoRaquetas');
    let html = '';

    raquetas.forEach((raqueta) => {
        html += `
            <div class="raqueta" data-id="${raqueta.id}">
                <h3>${raqueta.marca}</h3>
                <p><strong>Tipo:</strong> ${raqueta.tipo}</p>
                <p><strong>Precio:</strong> $${raqueta.precio.toFixed(2)}</p>
                <button class="agregarCarrito">Agregar al carrito</button>
            </div>`;
    });

    catalogoDiv.innerHTML = html;

    // Añadir eventos a los botones de agregar al carrito
    const botonesAgregarCarrito = catalogoDiv.querySelectorAll('.agregarCarrito');
    botonesAgregarCarrito.forEach((boton) => {
        boton.addEventListener('click', agregarAlCarrito);
    });
}

// Función para agregar al carrito
function agregarAlCarrito(event) {
    const button = event.target;
    const raquetaId = button.closest('.raqueta').dataset.id;

    // Encontrar la raqueta por su ID
    const raquetaSeleccionada = raquetas.find((raqueta) => raqueta.id === parseInt(raquetaId));

    // Agregar la raqueta al carrito
    carrito.push(raquetaSeleccionada);

    // Actualizar el carrito
    actualizarCarrito();
}

// Función para actualizar el carrito
function actualizarCarrito() {
    // Obtener los elementos del carrito y el total
    const listaCarrito = document.getElementById('listaCarrito');
    const totalCarrito = document.getElementById('totalCarrito');

    // Limpiar la lista del carrito
    listaCarrito.innerHTML = '';

    // Calcular el total
    let total = 0;

    // Agregar elementos al carrito y calcular el total
    carrito.forEach((raqueta, index) => {
        const li = document.createElement('li');
        li.textContent = `${raqueta.marca} - $${raqueta.precio.toFixed(2)} `;
        
        // Botón para eliminar la raqueta del carrito
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.addEventListener('click', () => eliminarDelCarrito(index));
        
        li.appendChild(botonEliminar);
        listaCarrito.appendChild(li);

        // Acumular el precio de la raqueta al total
        total += raqueta.precio;
    });

    // Actualizar el total en el HTML
    totalCarrito.textContent = total.toFixed(2);
}

// Función para eliminar del carrito
function eliminarDelCarrito(index) {
    // Eliminar la raqueta del carrito
    carrito.splice(index, 1);
    
    // Actualizar el carrito
    actualizarCarrito();
}

// Función para manejar la compra
function comprar() {
    // Verificar si el carrito está vacío
    if (carrito.length === 0) {
        // Si el carrito está vacío, muestra una alerta con SweetAlert
        Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'Por favor, añade productos al carrito antes de proceder con la compra.',
            confirmButtonText: 'Aceptar'
        });
        // No continuar con la compra si el carrito está vacío
        return;
    }

    // Aquí puedes agregar la lógica para continuar con la compra si el carrito no está vacío
    // Por ejemplo, procesar la compra, redirigir al usuario a otra página, etc.

    Swal.fire({
        icon: 'success',
        title: 'Compra realizada',
        text: 'Gracias por tu compra. ¡Esperamos que disfrutes de tus productos!',
        confirmButtonText: 'Aceptar'
    });

    // Vaciar el carrito después de la compra
    carrito.length = 0;

    // Actualizar el carrito en la interfaz
    actualizarCarrito();
}




// Añadir evento al botón de comprar
document.getElementById('btnComprar').addEventListener('click', comprar);

// Llama a la función para mostrar el catálogo al cargar la página
window.onload = function() {
    mostrarCatalogo();
};
