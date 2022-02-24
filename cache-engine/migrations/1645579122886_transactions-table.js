/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('transactions', {
        id: 'id',
        blockNumber: {
            type: 'int',
            notNull: true
        },
        hash: {
            type: 'varchar(66)',
            unique: true,
            notNull: true
        },
        sender: {
            type: 'varchar(64)',
            notNull: true
        },
        recipient: {
            type: 'varchar(64)',
            notNull: true
        },
        amount: {
            type: 'numeric(32,0)',
            notNull: true
        },
        gasFees: {
            type: 'numeric(32,0)',
            notNull: true
        },
        date: {
            type: 'timestamp',
            notNull: true
        },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp')
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('transactions')
};
