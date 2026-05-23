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
    watch: false
  }]
};