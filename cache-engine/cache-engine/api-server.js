/* import packages */
const express = require('express');
const bodyParser = require('body-parser')
const axios = require('axios').default

/* modules */
const db = require('./queries')

/* config */
require('dotenv').config()
const port = process.env.API_PORT || 3000


const mainLoop = async () => {
    /* setup app */
    const app = express()

    app.use(express.urlencoded({extended: true}));
    app.use(bodyParser.json());

    app.get('/', function (req, res) {
        res.send('Hello from BitGreen!');
    });

    app.get('/transactions', db.getTransactions)
    app.get('/transaction', db.getTransaction)

    app.get('/assets', db.getAssets)
    app.get('/assets/transactions', db.getAssetsTransactions)
    app.get('/assets/transaction', db.getAssetsTransaction)

    app.get('/impact_actions', db.getImpactActions)
    app.get('/impact_actions/auditors', db.getImpactActionsAuditors)
    app.get('/impact_actions/categories', db.getImpactActionsCategories)
    app.get('/impact_actions/oracles', db.getImpactActionsOracles)
    app.get('/impact_actions/proxies', db.getImpactActionsProxies)
    app.get('/impact_actions/approval_requests', db.getImpactActionsApprovalRequests)
    app.get('/impact_actions/approval_request', db.getImpactActionsApprovalRequest)
    app.get('/impact_actions/approval_requests/auditors', db.getImpactActionsApprovalRequestsAuditors)
    app.get('/impact_actions/approval_requests/auditors/votes', db.getImpactActionsApprovalRequestsAuditorsVotes)

    /* serve api */
    let server = app.listen(port, function () {
        console.log(`Server is listening on port ${port}.`)
    });
}
mainLoop();