# Bitgreen Cache Engine

### Installation
```
npm install
```

---

#### Database
**node-pg-migrate** package is being used for `postgresql` migrations.

To run migrations for this project run the command underneath. It will create all necessary tables and handle configuration.
```
npm run migrate up
```
To revert migration:
```
npm run migrate down
```

---

### Config
Copy `.env.example` to `.env` and set environment variables.
```
cp .env.example .env
nano .env
```
Edit `.env` file, and save it.

---

### Run Crawler
This script will listen for any new blocks.
```
npm run node
```

---

### Run API
This script will serve API. Please refer to [this page](docs/api.md) for more info.
```
npm run api
```