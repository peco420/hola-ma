# Arquitectura del Proyecto: Sitio Web de Limpieza

## Descripción del Proyecto
Este proyecto es una aplicación web de una sola página (SPA) para el negocio de productos de limpieza "Limpieza y varios 'Hola ma'". El sitio carga dinámicamente los productos desde un archivo JSON, permite a los usuarios filtrarlos por categoría, ver detalles en un modal interactivo y agregarlos a un "carrito de presupuesto". Este carrito no procesa pagos, sino que genera un resumen detallado del pedido y lo formatea en un mensaje listo para ser enviado por WhatsApp. El carrito persiste entre sesiones gracias al uso de `localStorage`.

## Arquitectura
El proyecto ha evolucionado a una arquitectura de SPA (Single Page Application) más robusta, aunque sigue sin utilizar frameworks externos para mantener la simplicidad y el rendimiento. La lógica de la aplicación reside completamente en el cliente (navegador).

- **Página Principal**: `index.html` - Contiene toda la estructura del sitio, incluyendo los contenedores para los elementos dinámicos y las plantillas de los modales.
- **Datos de Productos**: `productos.json` - Archivo JSON que actúa como una base de datos desacoplada, conteniendo toda la información de los productos.
- **Estilos**: `style.css` - Define la apariencia visual, el diseño responsivo y las animaciones de la interfaz.
- **Lógica de la Aplicación**: `script.js` - Orquesta toda la interactividad del sitio.
- **Recursos Gráficos**: Carpeta `images/` - Almacena las imágenes de los productos.

## Tecnologías Utilizadas
- **HTML5**: Estructura semántica de la página, incluyendo elementos como `<header>`, `<main>`, `<section>`, `<footer>` y atributos `data-*` para la manipulación desde JavaScript.
- **CSS3**: Estilos con características modernas como CSS Grid para el layout, Flexbox, transiciones y animaciones para una experiencia de usuario fluida, y media queries para un diseño completamente responsivo.
- **JavaScript (ES6+)**: Se utiliza de forma extensiva para:
  - **Manipulación del DOM**: Crear, modificar y eliminar elementos HTML dinámicamente.
  - **Asincronía (`fetch`)**: Cargar los datos de los productos desde `productos.json`.
  - **Gestión de Estado**: Manejar el estado del carrito de compras en un array de JavaScript.
  - **Almacenamiento Local (`localStorage`)**: Guardar el carrito para que persista entre sesiones y recargas de página.
  - **Manejo de Eventos**: Capturar interacciones del usuario en toda la aplicación (clics, etc.).

## Estructura de Archivos
```
sitio web limpieza/
├── images/
│   ├── jabon-liquido.jpg
│   ├── detergente.jpg
│   ├── desengrasante.jpg
│   ├── limpiavidrios.jpg
│   ├── desinfectante.jpg 
│   ├── Cloro.jpg
│   └── ...
├── productos.json
├── index.html          # Página principal con estructura HTML
├── style.css           # Hoja de estilos CSS
├── script.js           # Lógica de la aplicación (carga de datos, carrito, modales)
└── arquitectura.md     # Este archivo
```


### Detalles de Archivos
- **index.html**: 
-  - Header con título y descripción del negocio.
-  - Sección de productos con grid de items (productos hardcodeados en HTML).
-  - Sección de contacto con enlace a WhatsApp.
-  - Footer con copyright.
-  - Incluye referencias a `style.css` y `script.js`.
+  - Contiene la estructura base y los contenedores que serán poblados por JavaScript (grid de productos, filtros de categoría).
+  - Incluye las estructuras HTML ocultas para el modal de producto y el modal del carrito.

- **style.css**:
-  - Reset básico para consistencia.
-  - Estilos para header, main, productos, contacto y footer.
-  - Diseño responsivo con media queries para móviles y tablets.
-  - Usa CSS Grid para el layout de productos.
+  - Estilos para todos los componentes, incluyendo los elementos generados dinámicamente.
+  - Clases de estado (ej. `.active`) para controlar la visibilidad y animación de los modales.

- **script.js**:
-  - Espera a que el DOM cargue completamente.
-  - Agrega event listeners a cada producto para mostrar información al hacer click.
-- **Evento de Click en Producto**: `addEventListener('click')` - Muestra un alert con el nombre del producto y mensaje de contacto.
-- **Selección de Elementos**: `querySelectorAll('.producto')` - Selecciona todos los productos para agregar interactividad.
-- **Obtención de Nombre del Producto**: `querySelector('h3').textContent` - Extrae el nombre del producto del elemento h3.
+  - **Inicialización**: Al cargar el DOM, recupera el carrito de `localStorage` y realiza la petición `fetch` para obtener los datos de los productos.
+  - **Renderizado Dinámico**: Crea los botones de categoría y las tarjetas de producto a partir de los datos obtenidos.
+  - **Filtrado**: Maneja la lógica para mostrar productos según la categoría seleccionada.
+  - **Gestión de Modales**: Controla la apertura y cierre de los modales de producto y carrito, poblándolos con la información correspondiente.
+  - **Lógica del Carrito**: Contiene las funciones para agregar productos, aumentar/disminuir cantidades y calcular subtotales, descuentos y totales.
+  - **Persistencia**: Guarda el estado del carrito en `localStorage` cada vez que se modifica.
+  - **Generación de Mensaje**: Construye una URL con un mensaje pre-formateado para WhatsApp con el resumen completo del pedido.

-## Notas para Agentes de IA
-- El sitio es completamente estático; no requiere servidor backend.
-- Los productos están hardcodeados en `index.html`. Para agregar más productos dinámicamente, modificar el HTML o implementar un sistema de datos (ej. JSON).
-- El enlace de WhatsApp en `index.html:64` incluye un número de teléfono de ejemplo; reemplazar con el real.
-- Para extensiones futuras: Considerar agregar un carrito de compras o integración con APIs de pago, lo que requeriría JavaScript más avanzado o frameworks como React.
-- Diseño responsivo cubre dispositivos móviles, tablets y desktop.
+## Funcionalidades Clave
+- **Carga Dinámica de Productos**: Los productos se gestionan en `productos.json`, permitiendo añadir o modificar artículos sin tocar el código HTML.
+- **Filtro por Categorías**: Los usuarios pueden navegar fácilmente por el catálogo.
+- **Modal de Producto Detallado**: Al hacer clic en un producto, se abre un modal con más información y un selector de cantidad.
+- **Carrito de Presupuesto Persistente**:
+  - Los productos se pueden añadir al carrito.
+  - El carrito se guarda en `localStorage`, por lo que no se pierde al recargar la página.
+  - Permite modificar las cantidades de los productos directamente en el resumen.
+- **Sistema de Descuento por Volumen**: Aplica un 10% de descuento automáticamente si se cumplen las condiciones (5 o más unidades de cada producto).
+- **Generación de Pedido por WhatsApp**: El carrito culmina en un botón que abre WhatsApp con un mensaje detallado del pedido, incluyendo lista de productos, cantidades, subtotales, descuento y total.
+- **Interfaz Reactiva y Animada**: El uso de transiciones CSS proporciona una experiencia de usuario moderna y agradable.

Esta documentación permite a cualquier agente de IA entender rápidamente la estructura, localizar funciones específicas y proponer modificaciones o mejoras al proyecto.
