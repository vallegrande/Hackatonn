#!/bin/sh

# Reemplazar el valor de API_BACKEND en environment.ts
sed -i "s|http://localhost:8080|${API_BACKEND}|g" /app/src/environments/environment.ts

# Iniciar la aplicación
npm start
