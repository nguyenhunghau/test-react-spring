module.exports = {
    apps : [{
      name       : "myapp-client",
      script     : "./server.js",
      watch       : true,
      env: {
        "NODE_ENV": "production",
      },
      env_production : {
        "NODE_ENV": "production"
      }
    }]
  }