# Polkadot Cache Engine
### Installation
```
npm install
```
Then run migrations for `postgresql`
```
npm run migrate up
```
### Config
Copy `.env.example` to `.env` (create new file) and update it as needed.
```
cp .env.example .env
nano .env
```
### Run
```
npm run node
```