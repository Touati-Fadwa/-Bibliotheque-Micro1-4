# Utiliser une image officielle Node.js comme base
FROM node:21-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install --omit=dev

# Copier le dossier 'back' dans l'image Docker
COPY back /app/back

# Copier le reste de l'application (optionnel, si nécessaire)
COPY . .

# Exposer le port sur lequel tourne l'application
EXPOSE 3000

# Démarrer l'application
CMD ["node", "back/server.js"]
