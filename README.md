# cle-maps
Custom Learning Experience Google Maps

# Settings
config.json:
```
{
  "development": {
    "username": "root",
    "password": "root",
    "database": "cle",
    "host": "localhost",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

private.js:
```
module.exports = {
    'mapsApiKey': '123'
}
```
