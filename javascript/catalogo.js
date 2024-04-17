let raquetas = [
    { id: 1, marca: 'PaddleMaster', tipo: 'Profesional', precio: 129.99 },
    { id: 2, marca: 'SmashTech', tipo: 'Recreativa', precio: 59.99 },
    { id: 3, marca: 'SpeedyPaddle', tipo: 'Principiante', precio: 39.99 },
];

let carrito = [];

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

    
    const botonesAgregarCarrito = catalogoDiv.querySelectorAll('.agregarCarrito');
    botonesAgregarCarrito.forEach((boton) => {
        boton.addEventListener('click', agregarAlCarrito);
    });
}

// Función para agregar al carrito
function agregarAlCarrito(event) {
    const button = event.target;
    const raquetaId = button.closest('.raqueta').dataset.id;

    
    const raquetaSeleccionada = raquetas.find((raqueta) => raqueta.id === parseInt(raquetaId));

    
    carrito.push(raquetaSeleccionada);

    
    actualizarCarrito();
}

// Función para actualizar el carrito
function actualizarCarrito() {
    
    const listaCarrito = document.getElementById('listaCarrito');
    const totalCarrito = document.getElementById('totalCarrito');

    
    listaCarrito.innerHTML = '';

    
    let total = 0;

    
    carrito.forEach((raqueta, index) => {
        const li = document.createElement('li');
        li.textContent = `${raqueta.marca} - $${raqueta.precio.toFixed(2)} `;
        
        
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.addEventListener('click', () => eliminarDelCarrito(index));
        
        li.appendChild(botonEliminar);
        listaCarrito.appendChild(li);

        
        total += raqueta.precio;
    });

   
    totalCarrito.textContent = total.toFixed(2);
}

// Función para eliminar del carrito
function eliminarDelCarrito(index) {
   
    carrito.splice(index, 1);
    
    
    actualizarCarrito();
}

// Función para manejar la compra
function comprar() {
    
    if (carrito.length === 0) {
        
        Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'Por favor, añade productos al carrito antes de proceder con la compra.',
            confirmButtonText: 'Aceptar'
        });
        
        return;
    }

    Swal.fire({
        icon: 'success',
        title: 'Compra realizada',
        text: 'Gracias por tu compra. ¡Esperamos que disfrutes de tus productos!',
        confirmButtonText: 'Aceptar'
    });

    
    carrito.length = 0;

    
    actualizarCarrito();
}


document.getElementById('btnComprar').addEventListener('click', comprar);


window.onload = function() {
    mostrarCatalogo();
};
