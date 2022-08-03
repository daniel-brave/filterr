var bf = require("./bloomfilter")
BloomFilter = bf.BloomFilter
const https = require('https');
var jsonStore = require('./json-store');

function load() {
    return new Promise((resolve, reject) => {
        jsonStore.fetch().then(bfVal => {
            global.bloomFilterCounter = bfVal?.bloomFilterCounter || 0;
            var bloom = new BloomFilter(32 * 256, 16);
            if (bfVal?.bloomFilter && bfVal?.bloomFilter.length > 0) {
                var bloom = new BloomFilter(bfVal?.bloomFilter, 16);
            }
            resolve(bloom);
        })
    })
}

module.exports = { load };