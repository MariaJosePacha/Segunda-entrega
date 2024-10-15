const socket = io();

// Escuchar el evento 'productos' desde el servidor
socket.on('productos', (productos) => {
    const contenedorCards = document.querySelector('#productosList');
    contenedorCards.innerHTML = ''; // 

    productos.forEach(producto => {
        const listItem = document.createElement('li');
        listItem.className = 'producto-item';
        listItem.innerHTML = `
            <p>Título: ${producto.title}</p>
            <p>Descripción: ${producto.description}</p>
            <p>Precio: ${producto.price}</p>
            <p>Categoría: ${producto.category}</p>
            <p>Stock: ${producto.stock}</p>
            <button class="delete-btn" data-id="${producto.id}">Eliminar</button>
        `;
        contenedorCards.appendChild(listItem);

        const deleteButton = listItem.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {
            const productId = deleteButton.getAttribute('data-id');
            socket.emit('eliminarProducto', productId); // Emitir el evento de eliminación
        });
    });
});

// Escuchar el envío del formulario para agregar un nuevo producto
const productForm = document.querySelector('#productForm');
productForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Evitar que el formulario recargue la página

    // Obtener los valores de los campos del formulario
    const nuevoProducto = {
        title: document.querySelector('#title').value,
        price: document.querySelector('#price').value,
        description: document.querySelector('#description').value, 
        category: document.querySelector('#category').value, 
        stock: document.querySelector('#stock').value 
    };

    socket.emit('nuevoProducto', nuevoProducto); // Cambiado a 'nuevoProducto'

    // Limpiar los campos del formulario después de enviar el producto
    productForm.reset();
});
