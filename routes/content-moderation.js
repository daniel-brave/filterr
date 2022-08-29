var express = require("express");
var router = express.Router();
var jsonStore = require("../json-store");
const https = require("https");
const { CID } = require("multiformats/cid");
var fs = require("fs");
var path = require("path");

router.get("/add", function (req, res, next) {
  if (!req.query.cid) {
    res.status(404).send("Send a query string as cid");
    return;
  }
  let cid = req.query.cid;
  let verifiedCid = cid && CID.asCID(cid);
  if (verifiedCid) {
    res.status(404).send("Invalid cid");
    return;
  }

  // Analyse images
  analyzeImage(cid).then((analysis) => {
    if (
      analysis &&
      analysis.adult &&
      analysis.adult.isAdultContent === false &&
      analysis.adult.isRacyContent === false
    ) {
      // add to bloom filter
      this.bloomFilter.add(cid);

      this.bloomFilterCounter++;
      let newbf = {
        bloomFilter: [].slice.call(this.bloomFilter.buckets),
        bloomFilterCounter: this.bloomFilterCounter,
      };
      jsonStore.update(newbf);
      res.send(cid + " - CID is valid.\nCID has been added to bloom filter");
    } else {
      res.send("Rejected. Not Added cid: " + cid);
    }
  });
});

// Test the API routes
router.get("/test", function (req, res, next) {
  if (req.query.cid) {
    let cid = req.query.cid;
    // console.log('cid for testing', cid);
    if (cid && cid.length > 0) {
      let isPresent = this.bloomFilter.test(cid);
      res.send(isPresent);
    } else {
      res.status(404).send("Submit a valid cid");
    }
  } else {
    res.status(404).send("Send a query string as cid");
  }
});

// Script the code
router.get("/script", function (req, res, next) {
  var templatePath = path.join(
    __dirname,
    "..",
    "bloomfilter_script_template_min.js"
  );
  let script = fs.readFileSync(templatePath).toString();
  script = script.replace(
    "[LATEST_BLOOMFILTER_ARRAY]",
    JSON.stringify([].slice.call(this.bloomFilter.buckets))
  );
  script = script.replace(
    "[LATEST_BLOOMFILTER_COUNT]",
    this.bloomFilterCounter
  );
  res.send(script);
});

// Analyze Image
function analyzeImage(cidUrl) {
  return new Promise((resolve, reject) => {
    // const data = JSON.stringify({ url: "https://ipfs.io/ipfs/QmSygLmdfeStPU7TTCTbazvrUCggtGh5aNEK6cLarWZVsX" });
    const data = JSON.stringify({ url: "https://ipfs.io/ipfs/" + cidUrl });

    const options = {
      protocol: "https:",
      hostname: "southeastasia.api.cognitive.microsoft.com",
      port: 443,
      path: "/vision/v3.2/analyze?visualFeatures=Adult&language=en&model-version=latest",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
        "Ocp-Apim-Subscription-Key": process.env.AZURE_CV_KEY,
      },
    };

    const req = https.request(options, (res) => {
      res.on("data", (d) => {
        let metadata = JSON.parse(d);
        // console.log(metadata);
        resolve(metadata);
      });
    });

    req.on("error", (error) => {
      console.log("Error: " + error.message);
      console.log("ERRORED");
      reject();
    });

    req.write(data);
    req.end();
  });
}

// Get CID
router.get("/cid", function (req, res, next) {
  if (this.latestCID) {
    console.log("CID LOG");
    res.send(this.latestCID);
  } else {
    res.send("Not yet there");
  }
});

module.exports = router;
