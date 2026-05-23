# 🚀 mon-app-production

> Déploiement d'une API Node.js/Express en environnement de production simulé via GitHub Codespaces.

---

## 📖 Description

Ce projet documente le déploiement complet d'une application **Node.js/Express** en production, réalisé dans le cadre d'un TP de déploiement serveur.  
Il couvre l'ensemble de la chaîne : configuration du serveur, gestion des processus, reverse proxy, intégration continue, tests de charge et stratégie de rollback.

---

## 📂 Structure du projet

```
mon-app-production/
├── index.js
├── ecosystem.config.js
├── rollback.sh
├── package.json
├── package-lock.json
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## ⚙️ Stack technique

| Composant | Outil | Version |
|---|---|---|
| **Runtime** | Node.js | v24.14.0 |
| **Framework** | Express | — |
| **Gestionnaire de processus** | PM2 | v7.0.1 |
| **Serveur web** | Nginx | v1.24.0 |
| **CI/CD** | GitHub Actions | — |
| **Tests de charge** | ApacheBench | v2.3 |

---

## 🛠️ Installation & Démarrage

### 1. Cloner le dépôt

```bash
git clone git@github.com:hassan979-new/mon-app-production.git
cd mon-app-production
```

- <img width="960" height="504" alt="image" src="https://github.com/user-attachments/assets/0f4f828f-6cad-4da9-8106-3591a65e6d68" />


### 2. Installer les dépendances

```bash
npm ci
```

### 3. Créer le fichier d'environnement

```bash
cat > .env << EOF
NODE_ENV=production
PORT=3000
EOF
chmod 600 .env
```

### 4. Démarrer avec PM2

```bash
pm2 start ecosystem.config.js
pm2 save
```
- <img width="960" height="350" alt="image" src="https://github.com/user-attachments/assets/caf88f1e-1599-46cf-93f6-15c61f13018e" />

---

## 🔁 Déploiement

L'application est automatiquement déployée à chaque `push` sur la branche `main` via **GitHub Actions**.

### Déploiement manuel

```bash
cd /var/www/mon-app
git pull origin main
npm ci
pm2 reload ecosystem.config.js
```

### Rollback vers une version précédente

```bash
# Afficher l'historique des commits
git log --oneline

# Revenir à un commit spécifique
./rollback.sh <commit_hash>
```
- <img width="960" height="504" alt="image" src="https://github.com/user-attachments/assets/0dc59388-9cf6-46a4-8bbc-a9bd707b5bb5" />
- <img width="960" height="504" alt="image" src="https://github.com/user-attachments/assets/32deb209-5291-498e-b4cb-b5bc8e2642eb" />
---

## 🌐 Configuration Nginx

Nginx agit comme **reverse proxy**, redirigeant le trafic du port `80` vers l'application Node.js sur le port `3000`.

Fichier de configuration : `/etc/nginx/sites-available/mon-app`

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
- <img width="960" height="121" alt="image" src="https://github.com/user-attachments/assets/8978e565-5e37-46c5-85a9-7df689c8b175" />
- <img width="960" height="504" alt="image" src="https://github.com/user-attachments/assets/eacd1d0b-bc01-450d-a8e7-b6fa65456477" />
---

## ⚡ Configuration PM2

L'application tourne en **mode cluster** avec `max` instances et une limite mémoire de 200 Mo par instance.

```js
module.exports = {
  apps: [{
    name: 'mon-app-api',
    script: 'index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    watch: false,
    max_memory_restart: '200M'
  }]
};
```
- <img width="503" height="88" alt="image" src="https://github.com/user-attachments/assets/84eeff4f-549f-45e1-b5f9-7199f95f3daa" />

---

## 📊 Résultats des tests de charge

Tests réalisés avec **ApacheBench** : 1000 requêtes, 100 connexions simultanées.

```
ab -n 1000 -c 100 http://localhost/
```

| Métrique | Avant optimisation | Après optimisation |
|---|---|---|
| **Requêtes/seconde** | 1 586 req/s | 1 650 req/s ✅ |
| **Temps de réponse moyen** | 63 ms | 60 ms ✅ |
| **Requête la plus lente** | 106 ms | 85 ms ✅ |
| **Requêtes échouées** | 0 | 0 ✅ |

- <img width="960" height="504" alt="image" src="https://github.com/user-attachments/assets/e7894bf1-1fa7-4599-a3ad-e9f0d62f8834" />
- <img width="960" height="504" alt="image" src="https://github.com/user-attachments/assets/d2223425-286e-441c-a9c1-cfa49ff0617a" />
---

## 💾 Sauvegarde automatique

Un backup quotidien s'exécute à **2h du matin** via `cron`, en conservant les **5 dernières sauvegardes**.

```bash
# Lancer un backup manuellement
/home/codespace/backup.sh

# Lister les sauvegardes existantes
ls -lh /home/codespace/backups/
```
- <img width="578" height="326" alt="image" src="https://github.com/user-attachments/assets/1c341ea1-ab10-4f49-968f-5a5c51d475b1" />

---

## 🔐 Secrets GitHub Actions

Les secrets suivants doivent être configurés dans `Settings > Secrets and variables > Actions` :

| Secret | Description |
|---|---|
| `DEPLOY_HOST` | Adresse IP du serveur de production |
| `DEPLOY_USER` | Utilisateur SSH sur le serveur |
| `DEPLOY_KEY` | Clé SSH privée pour l'authentification |

- <img width="943" height="435" alt="image" src="https://github.com/user-attachments/assets/53af23c6-6c12-4186-a337-0bab9cbd1aba" />

---

## 🌍 API

### `GET /`

Retourne le statut de l'API.

```json
{
  "message": "API en production",
  "environment": "production",
  "timestamp": "2026-05-23T22:45:53.463Z"
}
```
- <img width="960" height="504" alt="image" src="https://github.com/user-attachments/assets/58ced8f7-b800-4736-aa4e-414494381cff" />

---

## 💡 Concepts abordés

- Déploiement sur un **VPS / environnement Linux**
- Gestion des processus Node.js avec **PM2** (cluster, reload sans interruption)
- **Reverse proxy** avec Nginx
- Pipeline **CI/CD** avec GitHub Actions
- **Tests de charge** et optimisation des performances
- **Rotation des logs** et sauvegarde automatique
- Stratégie de **rollback** par commit Git

---

## 🧑‍💻 Auteur

- 👤 **Agouram Hassan**
- ⚙️ Développement Node.js & DevOps
- 🎓 Instructor : **Mr. LACHGAR**
- 📅 23 Mai 2026
