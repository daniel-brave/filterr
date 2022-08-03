const https = require('https');
const ipfs = require('./ipfs');
const fs = require('fs');

function update(dataObj) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(dataObj);

        const options = {
            protocol: 'https:',
            hostname: 'api.jsonbin.io',
            port: 443,
            path: '/v3/b/6196368962ed886f9150cd5e',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': process.env.JSONBIN_MASTERKEY,
                'X-Bin-Versioning': false
            }
        };

        const req = https.request(options, res => {

            let responseData = ''

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                resolve(responseData);
            })
        });

        req.on("error", (error) => {
            console.log("Error: " + error.message);
            rej();
        });

        req.write(data)
        req.end();

        // fs.writeFileSync("./data/bloom-filter-data.json",JSON.stringify(dataObj),{encoding:'utf8',flag:'w'});
        ipfs(JSON.stringify(dataObj));
    })

}

function fetch() {
    return new Promise((resolve, reject) => {
        const options = {
            protocol: 'https:',
            hostname: 'api.jsonbin.io',
            port: 443,
            path: '/v3/b/6196368962ed886f9150cd5e',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': "$2b$10$pMds8aBsesGpOvTYjIHkVuxndzLV3YygCEtJ9kdYfGMXhG6pEySQa",
                'X-Bin-Versioning': false
            }
        };

        const req = https.request(options, res => {

            let responseData = ''

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                let d2 = JSON.parse(responseData);
                resolve(d2.record);
            })
        });

        console.log("Requesting")

        req.on("error", (error) => {
            console.log("JSONBIN Error: " + error.message);
            reject();
        });

        req.end();
    })

}

module.exports = { update, fetch }
