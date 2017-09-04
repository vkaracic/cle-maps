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
    "dialect": "mysql",
    "mapsApiKey": "your-google-maps-api-key",
    "sessionSecret": "top-secret"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "mapsApiKey": "your-google-maps-api-key",
    "sessionSecret": "top-secret"
  }
}
```
