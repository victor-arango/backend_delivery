const promise = require('bluebird');
const options = {
    promiseLib:promise,
    query:(e) => {}
}

const pgp = require('pg-promise')(options);
const types = pgp.pg.types;
types.setTypeParser(1114,function(StringValue){
    return StringValue; 
});

const databaseConfig = {
    host:'127.0.0.1',
    port: 5432,
    database: 'mensajeria_db',
    user: 'postgres',
    password: 'Emilymatias15'
};

const db=pgp(databaseConfig);

module.exports = db;