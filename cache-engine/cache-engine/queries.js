const Pool = require('pg').Pool
const pool = new Pool()

const getBlockByNumber = (request, response) => {
    let {number} = request

    pool.query('SELECT * FROM blocks WHERE number = $1',
        [number], (error, results) => {
            if (error) {
                return error
            }
            return results.rows;
        })
}

const storeBlock = (request, response) => {
    let {number, hash, date} = request
    date = new Date(parseInt(date)).toISOString()

    pool.query('SELECT * FROM blocks WHERE number = $1',
        [number], (error, results) => {
            if (error) {
                return error
            }
            if (results.rows.length > 0) {
                pool.query('UPDATE blocks SET hash = $1, date = $2 WHERE number = $3',
                    [hash, date, number], (error, results) => {
                        if (error) {
                            return error
                        }
                    })
            } else {
                pool.query('INSERT INTO blocks ("number", "hash", "date") VALUES ($1, $2, $3)',
                    [number, hash, date], (error, results) => {
                        if (error) {
                            return error
                        }
                    })
            }
        })
}

const storeTransaction = (request, response) => {
    let {block_number, hash, sender, recipient, amount, gas_fees, date} = request
    date = new Date(parseInt(date)).toISOString()

    pool.query('INSERT INTO transactions ("block_number", "hash", "sender", "recipient", "amount", "gas_fees", "date") VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [block_number, hash, sender, recipient, amount, gas_fees, date], (error, results) => {
            if (error) {
                throw error
            }
            // response.status(201).send(`User added with ID: ${result.insertId}`)
        })
}

const getTransactions = (request, response) => {
    let account = request.query.account;
    let date_start = '1990-01-01';
    let date_end = '2100-12-31';
    if (typeof request.query.date_start !== 'undefined') {
        date_start = request.query.date_start;
    }
    if (typeof request.query.date_end !== 'undefined') {
        date_end = request.query.date_end;
    }

    pool.query('SELECT * FROM transactions WHERE (sender = $1 OR recipient = $1) AND date >= $2 AND date <= $3 ORDER BY date,id DESC',
        [account, date_start, date_end], (error, results) => {
            if (error) {
                throw error
            }
            response.json({
                transactions: results.rows
            })
        })
}

const getTransaction = (request, response) => {
    let hash = request.query.hash;

    pool.query('SELECT * FROM transactions WHERE hash = $1',
        [hash], (error, results) => {
            if (error) {
                throw error
            }
            if(results.rows.length === 0) {
                return response.json({
                    error: 'Transaction not found.'
                }).status(404)
            }
            response.json({
                transaction: results.rows
            })
        })
}

const getAssets = (request, response) => {
    pool.query('SELECT * FROM ft_assets ORDER BY date,id DESC',
        [], (error, results) => {
            if (error) {
                throw error
            }
            response.json({
                assets: results.rows
            })
        })
}

const getAssetsTransactions = (request, response) => {
    let account = request.query.account;
    let date_start = '1990-01-01';
    let date_end = '2100-12-31';
    if (typeof request.query.date_start !== 'undefined') {
        date_start = request.query.date_start;
    }
    if (typeof request.query.date_end !== 'undefined') {
        date_end = request.query.date_end;
    }
    let asset_id = request.query.asset_id;

    pool.query('SELECT * FROM ft_transactions WHERE (sender = $1 OR recipient = $1) AND date >= $2 AND date <= $3 AND asset_id = $4 ORDER BY date,id DESC',
        [account, date_start, date_end, asset_id], (error, results) => {
            if (error) {
                throw error
            }
            response.json({
                transactions: results.rows
            })
        })
}

const getAssetsTransaction = (request, response) => {
    let hash = request.query.hash;

    pool.query('SELECT * FROM ft_transactions WHERE hash = $1',
        [hash], (error, results) => {
            if (error) {
                throw error
            }
            if(results.rows.length === 0) {
                return response.json({
                    error: 'Transaction not found.'
                }).status(404)
            }
            response.json({
                transaction: results.rows
            })
        })
}

getImpactActions = (request, response) => {
    pool.query('SELECT * FROM impact_actions ORDER BY date,id DESC',
        [], (error, results) => {
            if (error) {
                throw error
            }
            response.json({
                impact_actions: results.rows
            })
        })
}

getImpactActionsApprovalRequests = (request, response) => {
    pool.query('SELECT * FROM impact_actions_approval_requests ORDER BY date,id DESC',
        [], (error, results) => {
            if (error) {
                throw error
            }
            response.json({
                impact_actions_approval_requests: results.rows
            })
        })
}

getImpactActionsApprovalRequest = (request, response) => {
    let approval_request_id = request.query.approval_request_id;

    pool.query('SELECT * FROM impact_actions_approval_requests WHERE id = $1',
        [approval_request_id], (error, results) => {
            if (error) {
                throw error
            }
            if(results.rows.length === 0) {
                return response.json({
                    error: 'Approval request not found.'
                }).status(404)
            }
            response.json({
                approval_requests: results.rows
            })
        })
}

getImpactActionsApprovalRequestsAuditors = (request, response) => {
    let approval_request_id = request.query.approval_request_id;

    pool.query('SELECT * FROM impact_actions_approval_requests_auditors WHERE approval_request_id = $1 ORDER BY date,id DESC',
        [approval_request_id], (error, results) => {
            if (error) {
                throw error
            }
            response.json({
                impact_actions_approval_requests_auditors: results.rows
            })
        })
}

getImpactActionsApprovalRequestsAuditorsVotes = (request, response) => {
    let approval_request_id = request.query.approval_request_id;

    pool.query('SELECT * FROM impact_actions_approval_requests_auditors_votes WHERE approval_request_id = $1 ORDER BY date,id DESC',
        [approval_request_id], (error, results) => {
            if (error) {
                throw error
            }
            response.json({
                impact_actions_approval_requests_auditors_votes: results.rows
            })
        })
}

getImpactActionsAuditors = (request, response) => {
    pool.query('SELECT * FROM impact_actions_auditors ORDER BY date,id DESC',
        [], (error, results) => {
            if (error) {
                throw error
            }
            response.json({
                impact_actions_auditors: results.rows
            })
        })
}

getImpactActionsCategories = (request, response) => {
    pool.query('SELECT * FROM impact_actions_categories ORDER BY date,id DESC',
        [], (error, results) => {
            if (error) {
                throw error
            }
            response.json({
                impact_actions_categories: results.rows
            })
        })
}

getImpactActionsOracles = (request, response) => {
    pool.query('SELECT * FROM impact_actions_oracles ORDER BY date,id DESC',
        [], (error, results) => {
            if (error) {
                throw error
            }
            response.json({
                impact_actions_oracles: results.rows
            })
        })
}

getImpactActionsProxies = (request, response) => {
    pool.query('SELECT * FROM impact_actions_proxies ORDER BY date,id DESC',
        [], (error, results) => {
            if (error) {
                throw error
            }
            response.json({
                impact_actions_proxies: results.rows
            })
        })
}

module.exports = {
    storeBlock,
    storeTransaction,

    getTransactions,
    getTransaction,

    getAssets,
    getAssetsTransactions,
    getAssetsTransaction,

    getImpactActions,
    getImpactActionsApprovalRequests,
    getImpactActionsApprovalRequest,
    getImpactActionsApprovalRequestsAuditors,
    getImpactActionsApprovalRequestsAuditorsVotes,
    getImpactActionsAuditors,
    getImpactActionsCategories,
    getImpactActionsOracles,
    getImpactActionsProxies,
}