# Fashion Store - Sistema de Delivery de Ropa 👗

Este es un sistema completo de delivery para tienda de ropa que incluye tres aplicaciones diferentes para clientes, administradores de tienda y repartidores.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

## 🚀 Características

### App Cliente (app1)
- Inicio de sesión funcional
- Ver todas las tiendas de ropa disponibles
- Ver productos de ropa con imágenes
- Agregar productos al carrito con vista previa
- Crear órdenes con método de pago y dirección
- Ver historial de órdenes

### App Tienda (app2)
- Inicio de sesión funcional
- Ver información de la tienda
- Abrir/cerrar tienda para recibir pedidos
- Gestionar productos de ropa (crear con imágenes, ver lista)
- Ver órdenes de la tienda

### App Repartidor (app3)
- Inicio de sesión funcional
- Ver órdenes disponibles para entrega
- Ver detalles de órdenes
- Aceptar órdenes
- Gestionar órdenes aceptadas
- Marcar órdenes como entregadas

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js + Express
- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Base de datos**: In-memory (arrays de JavaScript)
- **Autenticación**: JWT simple (token basado en ID de usuario)

## 📦 Instalación

1. **Clona el repositorio:**
```bash
git clone https://github.com/ospinaa/Lab--3.git
cd Lab--3
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Inicia el servidor:**
```bash
npm start
```

4. **Abre tu navegador en:** `http://localhost:5050`

## 🚀 Uso Rápido

1. Ve a `http://localhost:5050`
2. Selecciona la aplicación que deseas usar
3. Usa las credenciales de prueba para iniciar sesión
4. ¡Explora todas las funcionalidades!

## 🔑 Credenciales de Prueba

### Cliente
- **Email**: consumidor@test.com
- **Contraseña**: 123

### Tienda
- **Email**: tienda@test.com
- **Contraseña**: 123

### Repartidor
- **Email**: repartidor@test.com
- **Contraseña**: 123

## 🏗️ Estructura del Proyecto

```
├── index.js              # Servidor principal con todos los endpoints
├── package.json          # Dependencias del proyecto
├── public/
│   └── index.html        # Página principal con enlaces a las apps
├── app1/                 # App Consumidor
│   ├── index.html
│   ├── styles.css
│   └── index.js
├── app2/                 # App Tienda
│   ├── index.html
│   ├── styles.css
│   └── index.js
└── app3/                 # App Repartidor
    ├── index.html
    ├── styles.css
    └── index.js
```

## 🔌 Endpoints de la API

### Autenticación
- `POST /api/login` - Iniciar sesión

### Consumidor
- `GET /api/consumer/stores` - Ver todas las tiendas
- `GET /api/consumer/stores/:id` - Ver detalle de tienda
- `GET /api/consumer/stores/:id/products` - Ver productos de tienda
- `GET /api/consumer/cart` - Ver carrito
- `POST /api/consumer/cart/add` - Agregar producto al carrito
- `POST /api/consumer/orders` - Crear orden
- `GET /api/consumer/orders` - Ver órdenes del usuario

### Tienda
- `GET /api/store/info` - Ver información de la tienda
- `PUT /api/store/toggle` - Abrir/cerrar tienda
- `GET /api/store/products` - Ver productos de la tienda
- `POST /api/store/products` - Crear producto
- `GET /api/store/orders` - Ver órdenes de la tienda

### Repartidor
- `GET /api/delivery/orders` - Ver órdenes disponibles
- `GET /api/delivery/orders/:id` - Ver detalle de orden
- `POST /api/delivery/orders/:id/accept` - Aceptar orden
- `GET /api/delivery/my-orders` - Ver órdenes aceptadas
- `PUT /api/delivery/orders/:id/complete` - Completar entrega

## 🎯 Flujo de Uso

1. **Consumidor**:
   - Inicia sesión
   - Ve las tiendas disponibles
   - Selecciona una tienda y ve sus productos
   - Agrega productos al carrito
   - Procede al checkout con método de pago y dirección
   - Ve sus órdenes creadas

2. **Tienda**:
   - Inicia sesión
   - Ve la información de su tienda
   - Abre/cierra la tienda según necesite
   - Gestiona productos (crear nuevos)
   - Ve las órdenes que recibe

3. **Repartidor**:
   - Inicia sesión
   - Ve las órdenes disponibles para entrega
   - Ve los detalles de una orden específica
   - Acepta órdenes
   - Gestiona sus órdenes aceptadas
   - Marca órdenes como entregadas

## 🔒 Seguridad

- Autenticación basada en tokens
- Validación de tipos de usuario en cada endpoint
- Verificación de permisos por rol
- Validación de datos de entrada

## 📱 Responsive Design

Todas las aplicaciones están diseñadas para ser responsive y funcionar tanto en desktop como en dispositivos móviles.

## 📸 Capturas de Pantalla

### Página Principal
- Interfaz moderna con navegación intuitiva
- Cards interactivas para cada aplicación
- Diseño responsive

### App Cliente
- Catálogo de productos con imágenes
- Carrito de compras funcional
- Proceso de checkout completo

### App Tienda
- Panel de administración
- Gestión de productos con imágenes
- Control de estado de tienda

### App Repartidor
- Lista de órdenes disponibles
- Gestión de entregas
- Seguimiento de estado

## 🛠️ Características Técnicas

- **Arquitectura**: Monolítica con separación de responsabilidades
- **Frontend**: HTML5, CSS3, JavaScript Vanilla (sin frameworks)
- **Backend**: Node.js + Express
- **Autenticación**: Sistema de tokens simple
- **Almacenamiento**: In-memory (datos en arrays de JavaScript)
- **API**: RESTful con endpoints bien documentados
- **Responsive**: Diseño adaptable a móviles y desktop

## 🚀 Próximas Mejoras

- [ ] Base de datos persistente (MongoDB/PostgreSQL)
- [ ] Autenticación JWT real
- [ ] Notificaciones en tiempo real
- [ ] Sistema de calificaciones
- [ ] Geolocalización
- [ ] Pagos integrados
- [ ] Panel de administración
- [ ] Tests automatizados
- [ ] Docker containerization

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Juan Ospina**
- GitHub: [@ospinaa](https://github.com/ospinaa)
- Proyecto: [Lab-3](https://github.com/ospinaa/Lab--3)

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!
