const ipfs = require('ipfs-http-client');

const infura = { host: "ipfs.infura.io", port: "5001", protocol: "https" };

const client = ipfs.create(infura)

function deploy(data) {
 client.add(data).then(cid => {
   global.latestCID = cid.path;
 });
}

module.exports = deploy;