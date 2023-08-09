const neo = require('../../Speed/neo.js');

async function getData(){
    const data = await neo.getData();
    return data;
}

module.exports.getData = getData;
