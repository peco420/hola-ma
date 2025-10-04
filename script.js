// Agregar funcionalidad básica
document.addEventListener('DOMContentLoaded', function() {
    const productosGrid = document.querySelector('.productos-grid');
    const categoriasContainer = document.getElementById('categorias-filtro');
    let todosLosProductos = [];
    let carrito = [];
 
    // Elementos del Modal
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    const modalImg = document.getElementById('modal-img');
    const modalNombre = document.getElementById('modal-nombre');
    const modalDescripcion = document.getElementById('modal-descripcion');
    const modalPrecio = document.getElementById('modal-precio');
    const modalOfertas = document.getElementById('modal-ofertas');

    // Elementos del selector de cantidad del modal
    const modalCantidadDisminuir = document.getElementById('modal-cantidad-disminuir');
    const modalCantidadAumentar = document.getElementById('modal-cantidad-aumentar');
    const modalCantidadValor = document.getElementById('modal-cantidad-valor');
    
    // Elementos de acción del Modal
    const modalWhatsappBtn = document.getElementById('modal-whatsapp-btn');
    const modalCarritoBtn = document.getElementById('modal-carrito-btn');

    // Elementos del Carrito
    const carritoIcono = document.getElementById('carrito-icono');
    const carritoContador = document.getElementById('carrito-contador');
    const carritoModalOverlay = document.getElementById('carrito-modal-overlay');
    const carritoModalClose = document.getElementById('carrito-modal-close');
    const carritoItemsContainer = document.getElementById('carrito-items');
    const carritoTotalPrecio = document.getElementById('carrito-total-precio');
    const carritoSubtotalPrecio = document.getElementById('carrito-subtotal-precio');
    const enviarPedidoBtn = document.getElementById('enviar-pedido-btn');
    const resumenDescuento = document.getElementById('resumen-descuento');
    const carritoIncentivoDescuento = document.getElementById('carrito-incentivo-descuento');


    // Función para mostrar productos en el DOM
    const mostrarProductos = (productosAMostrar) => {
        productosGrid.innerHTML = ''; // Limpiar la grilla
        productosAMostrar.forEach(productoData => {
            const productoDiv = document.createElement('div');
            productoDiv.className = 'producto';
            productoDiv.dataset.nombre = productoData.nombre; // Añadir data-attribute
            productoDiv.innerHTML = `
                <img src="${productoData.img}" alt="${productoData.alt}">
                <h3>${productoData.nombre}</h3>
                <p>${productoData.descripcion}</p>
                <p class="precio">${productoData.precio}</p>
            `;
            // Agregar evento de clic a cada producto
            productoDiv.addEventListener('click', function() {
                abrirModalProducto(productoData);
            });
            productosGrid.appendChild(productoDiv);
        });
    };

    const abrirModalProducto = (productoData) => {
        let cantidad = 1;

        const actualizarVistaCantidad = () => {
            modalCantidadValor.textContent = cantidad;
            modalCantidadDisminuir.disabled = cantidad <= 1;
        };

        modalCantidadAumentar.onclick = () => {
            cantidad++;
            actualizarVistaCantidad();
        };
        modalCantidadDisminuir.onclick = () => {
            if (cantidad > 1) cantidad--;
            actualizarVistaCantidad();
        };

        modalImg.src = productoData.img;
        modalImg.alt = productoData.alt;
        modalNombre.textContent = productoData.nombre;
        modalDescripcion.textContent = productoData.descripcion;
        modalPrecio.textContent = productoData.precio;
        modalOfertas.innerHTML = '<p><strong>¡Oferta Especial!</strong> Llevando 10 o más productos en total, obtienes un <strong>10% de descuento</strong> en tu compra.</p>';
        actualizarVistaCantidad();
        const whatsappMsg = encodeURIComponent(`Hola, estoy interesado en el producto: ${productoData.nombre}`);
        modalWhatsappBtn.href = `https://wa.me/5491130814028?text=${whatsappMsg}`;
        modalCarritoBtn.onclick = () => {
            agregarAlCarrito(productoData, cantidad);
            cerrarModalProducto();
        };
        modalOverlay.classList.add('active');
    };

    // Función para crear los botones de categoría
    const crearBotonesCategoria = (productos) => {
        const categorias = ['Todos', ...new Set(productos.map(p => p.categoria))];
        
        categorias.forEach(categoria => {
            const boton = document.createElement('button');
            boton.className = 'categoria-btn';
            boton.textContent = categoria;
            if (categoria === 'Todos') {
                boton.classList.add('active');
            }
            boton.addEventListener('click', () => {
                // Filtrar productos
                const productosFiltrados = categoria === 'Todos' 
                    ? todosLosProductos 
                    : todosLosProductos.filter(p => p.categoria === categoria);
                mostrarProductos(productosFiltrados);

                // Actualizar clase activa en botones
                document.querySelectorAll('.categoria-btn').forEach(btn => btn.classList.remove('active'));
                boton.classList.add('active');
            });
            categoriasContainer.appendChild(boton);
        });
    };

    // Cargar productos desde el archivo JSON
    fetch('productos.json')
        .then(response => response.ok ? response.json() : Promise.reject('No se pudo cargar productos.json'))
        .then(data => {
            todosLosProductos = data;
            // Crear los botones de filtro y mostrar productos
            crearBotonesCategoria(todosLosProductos);
            mostrarProductos(todosLosProductos);
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
            productosGrid.innerHTML = '<p>No se pudieron cargar los productos. Inténtalo de nuevo más tarde.</p>';
        });

    // Lógica para cerrar el modal
    const cerrarModalProducto = () => {
        modalOverlay.classList.remove('active');
    };

    modalClose.addEventListener('click', cerrarModalProducto);
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) cerrarModalProducto();
    });

    // --- LÓGICA DEL CARRITO ---

    const agregarAlCarrito = (producto, cantidadAAgregar) => {
        const productoExistente = carrito.find(item => item.nombre === producto.nombre);
        if (productoExistente) {
            productoExistente.cantidad += cantidadAAgregar;
        } else {
            // Extraer el valor numérico del precio
            const precioNumerico = parseFloat(producto.precio.replace('$', '').replace('.', ''));
            carrito.push({ ...producto, cantidad: cantidadAAgregar, precioNumerico });
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
    };

    const actualizarCarrito = () => {
        // Actualizar contador del ícono
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        carritoContador.textContent = totalItems;

        // Actualizar contenido del modal del carrito
        carritoItemsContainer.innerHTML = '';
        if (carrito.length === 0) {
            carritoIncentivoDescuento.style.display = 'none';
            carritoItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        } else {
            carrito.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'carrito-item';
                itemDiv.innerHTML = `
                    <div class="carrito-item-info" style="flex-grow: 1;">
                        <strong>${item.nombre}</strong><br>
                        <span>${item.precio} c/u</span>
                    </div>
                    <div class="carrito-item-controles">
                        <button class="control-btn" data-nombre="${item.nombre}" data-accion="disminuir">-</button>
                        <span class="cantidad">${item.cantidad}</span>
                        <button class="control-btn" data-nombre="${item.nombre}" data-accion="aumentar">+</button>
                    </div>
                    <strong style="min-width: 80px; text-align: right;">$${(item.cantidad * item.precioNumerico).toFixed(2)}</strong>
                `;
                carritoItemsContainer.appendChild(itemDiv);
            });
        }

        // Calcular y mostrar total
        const subtotal = carrito.reduce((sum, item) => sum + (item.cantidad * item.precioNumerico), 0);
        let totalFinal = subtotal;
        let valorDescuento = 0;
        
        // Lógica de descuento: 10% si el total de items es 10 o más
        if (totalItems >= 10) {
            valorDescuento = subtotal * 0.10;
            totalFinal = subtotal - valorDescuento;
            resumenDescuento.style.display = 'flex';
            document.getElementById('carrito-descuento-valor').textContent = `-$${valorDescuento.toFixed(2)}`;
            carritoIncentivoDescuento.style.display = 'none'; // Ocultar incentivo si ya aplica
        } else {
            resumenDescuento.style.display = 'none';
            // Mostrar incentivo si hay productos en el carrito pero no aplica el descuento
            carritoIncentivoDescuento.style.display = carrito.length > 0 ? 'block' : 'none';
            const itemsFaltantes = 10 - totalItems;
            carritoIncentivoDescuento.innerHTML = `¡Agrega <strong>${itemsFaltantes} producto${itemsFaltantes > 1 ? 's' : ''} más</strong> para obtener un <strong>10% de descuento</strong>!`;
        }
        
        carritoSubtotalPrecio.textContent = `$${subtotal.toFixed(2)}`;
        carritoTotalPrecio.textContent = `$${totalFinal.toFixed(2)}`;

        // Generar mensaje de WhatsApp
        generarMensajeWhatsApp({subtotal, valorDescuento, totalFinal});
    };

    const generarMensajeWhatsApp = (resumen) => {
        let mensaje = "¡Hola! Quisiera hacer el siguiente pedido:\n\n";
        carrito.forEach(item => {
            const subtotalItem = item.cantidad * item.precioNumerico;
            mensaje += `- ${item.nombre} (x${item.cantidad}) - $${subtotalItem.toFixed(2)}\n`;
        });
        mensaje += `\n*Subtotal: $${resumen.subtotal.toFixed(2)}*`;
        if (resumen.valorDescuento > 0) {
            mensaje += `\n*Descuento (10%): -$${resumen.valorDescuento.toFixed(2)}*`;
        }
        mensaje += `\n*Total del pedido: $${resumen.totalFinal.toFixed(2)}*\n\n`;
        mensaje += "¿Tienen stock disponible? ¡Muchas gracias!";

        enviarPedidoBtn.href = `https://wa.me/5491130814028?text=${encodeURIComponent(mensaje.replace(/\*/g, ''))}`;
    };

    const abrirModalCarrito = () => {
        actualizarCarrito();
        carritoModalOverlay.classList.add('active');
    };

    const cerrarModalCarrito = () => {
        carritoModalOverlay.classList.remove('active');
    };

    carritoIcono.addEventListener('click', abrirModalCarrito);
    carritoModalClose.addEventListener('click', cerrarModalCarrito);
    carritoModalOverlay.addEventListener('click', (e) => e.target === carritoModalOverlay && cerrarModalCarrito());

    // Manejo de eventos para los controles del carrito (delegación)
    carritoItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('control-btn')) {
            const nombre = e.target.dataset.nombre;
            const accion = e.target.dataset.accion;

            if (accion === 'aumentar') {
                aumentarCantidad(nombre);
            } else if (accion === 'disminuir') {
                disminuirCantidad(nombre);
            }
        }
    });

    // --- INICIALIZACIÓN ---

    const inicializar = () => {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) carrito = JSON.parse(carritoGuardado);
        actualizarCarrito(); // Actualiza el contador y prepara el modal del carrito
    };        

    const aumentarCantidad = (nombre) => {
        const item = carrito.find(p => p.nombre === nombre);
        if (item) item.cantidad++;
        actualizarCarrito();
    };

    const disminuirCantidad = (nombre) => {
        const itemIndex = carrito.findIndex(p => p.nombre === nombre);
        if (itemIndex > -1) {
            if (carrito[itemIndex].cantidad > 1) carrito[itemIndex].cantidad--;
            else carrito.splice(itemIndex, 1); // Eliminar si la cantidad es 1
            actualizarCarrito();
        }
    };
});