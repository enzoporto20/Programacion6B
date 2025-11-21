# PcGamers – Backend

Este proyecto corresponde al backend del sistema PcGamers, desarrollado con Node.js, Express y MongoDB. Su función principal es gestionar el inventario de computadoras gamer y ofrecer la estructura base para el funcionamiento completo del sistema.

# Instalación y Ejecución

Para iniciar el backend, primero es necesario instalar todas las dependencias del proyecto. Luego, se puede ejecutar el servidor utilizando nodemon, lo que permite reinicios automáticos cada vez que se realizan cambios.
El servidor también establece la conexión inicial con MongoDB y carga los middlewares principales para manejar JSON, CORS y archivos estáticos.

# Pasos esenciales:

Instalar dependencias:

npm install

Ejecutar el servidor con nodemon apuntando a index.js:

nodemon ./index.js

El servidor queda disponible en el puerto configurado (por defecto 3000).

Descripción Resumida de las Rutas de la API

# La API utiliza como ruta base:

/api/pcgamers/

Dentro de esta ruta se encuentran todas las operaciones relacionadas con el manejo de computadoras gamer.

Estas rutas permiten realizar las funciones principales:

GET / — Obtiene todas las PcGamers registradas.

GET /:id — Obtiene una PcGamer por su ID.

POST / — Crea una nueva PcGamer.

PUT /:id — Actualiza una PcGamer existente.

DELETE /:id — Elimina una PcGamer por ID.

# Fin del proyecto

Este proyecto me permitió reforzar mis conocimientos en desarrollo backend con Node.js y Express. Al estructurar las rutas, controladores y la conexión hacia MongoDB, comprendí mejor cómo funciona una API real y cómo organizarla correctamente.
Ha sido una experiencia muy valiosa para mejorar mis habilidades, y me motiva a seguir creando sistemas más completos, escalables y profesionales.