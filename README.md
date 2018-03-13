# Inventario Microservicio - Uniandes:


Dockerfile	- Archivo de configuración para uso en Docker

config.js	- Archivo de configuración de mongoDB

docker-compose.yml	- Archivo de configuración para uso en Docker

package.json	- Archivo de descripción JSON de código

server.js	- Archivo de configuración principal

servicio.yml	- Archivo de servicio

app/models/product_quantity.js - Archivo de variables y despliegue


# USO:

Localmente se puede validar el microservicio de la sigueinte manera:

Registro de queja:

curl -X PUT http://127.0.0.1:8888/product_quantities/12345 -d "quantity_onhand=15"

Consulta de queja:

curl -X GET http://127.0.0.1:8888/product_quantities/12345
