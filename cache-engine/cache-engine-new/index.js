const { ApiPromise, WsProvider } = require('@polkadot/api');
const db = require('./queries')

require('dotenv').config()

async function main () {
    // Initialise the provider to connect to the local node
    const provider = new WsProvider('wss://rpc.polkadot.io');

    // Create the API and wait until ready
    const api = await ApiPromise.create({ provider });

    // Retrieve the chain & node information via rpc calls
    const [chain, nodeName, nodeVersion] = await Promise.all([
        api.rpc.system.chain(),
        api.rpc.system.name(),
        api.rpc.system.version()
    ]);

    console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

    // We only display a couple, then unsubscribe
    let count = 0;

    // Subscribe to the new headers on-chain. The callback is fired when new headers
    // are found, the call itself returns a promise with a subscription that can be
    // used to unsubscribe from the newHead subscription
    const unsubscribe = await api.rpc.chain.subscribeNewHeads(async(header) => {
        console.log(`Chain is at block: #${header.number}`);
        // console.log(header);
        console.log('Block Hash: ' + header.hash.toHex());

        // let signed_block = await api.rpc.chain.getBlock(header.hash);
        let [signed_block, block_events] = await Promise.all([
            api.rpc.chain.getBlock(header.hash),
            api.query.system.events.at(header.hash)
        ]);

        let current_time
        signed_block.block.extrinsics.forEach((ex, index) => {
            const method = ex.method.method.toString()
            const section = ex.method.section.toString()
            const isSigned = ex.isSigned
            const txHash = ex.hash.toHex()
            let recipient, amount

            let signedByAddress = null
            if(isSigned) {
                signedByAddress = ex.signer.toString()
            }

            if(section === 'timestamp' && method === 'set') {
                ex.args.forEach(( arg, d ) => {
                    current_time = arg.toString();
                });
            }

            if(section === 'balances' && (method === 'transferKeepAlive' || method === 'transfer')) {
                block_events
                    .filter(({ phase }) =>
                        phase.isApplyExtrinsic &&
                        phase.asApplyExtrinsic.eq(index)
                    )
                    .forEach(({ event }) => {
                        if(api.events.system.ExtrinsicSuccess.is(event)) {
                            console.log('Transaction Hash: ' + txHash);

                            ex.args.forEach(( arg, d ) => {
                                if(d === 0) {
                                    recipient = arg.toHuman()['Id'];
                                } else if(d === 1) {
                                    amount = arg.toString();
                                }
                            });

                            db.storeTransaction({
                                blockNumber: header.number,
                                hash: txHash,
                                sender: signedByAddress,
                                recipient: recipient,
                                amount: amount,
                                gasFees: 0,
                                date: current_time,
                            })
                        }
                    })
            }
        });

        db.storeBlock({
            number: header.number,
            hash: header.hash.toHex(),
            date: current_time,
        })

        console.log('-----------------------------------------------------');

        if (++count === 20) {
            unsubscribe();
            process.exit(0);
        }
    });
}

main().catch(console.error);