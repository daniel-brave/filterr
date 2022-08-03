# Filterr-IPFS

Filterr-IPFS is an instant content moderation tool for IPFS links (cid).
[Demo](https://youtu.be/ALnR0c8ZGrc)

It whitelists safe cids and provides it as a BloomFilter object.

## Reasoning

Unlike conventional user content, IPFS uploaded data is secured by the cid. We should not need to repeatedly run checks against this already available data. It should be a one time curation.

With NFTs gaining popularity, using NFT linked images/content as user representation is increasing and lot of dapps shouldn't need to setup content moderation as it slows down the process. This represents using cid concept effectively to help the community with a moderation service.

## Usage

Include the script in your html and use the script 'test' function to check the whitelist.

The script includes the most recent bloomfilter data so you are filtering on the latest list

```javascript
// Load the script (latest bloom-filters are downloaded at load time)
<script src="https://filterripfs.azurewebsites.net/cidfeed/script"></script>;

// test if your images are safe to view
BloomFilter.test(cid);
```

## Notes

You can add new cids to the bloomfilter by using the api.

When the script is pulled, script-template is updated with the latest bloomfilter and you get the latest script.

## License

[MIT](https://choosealicense.com/licenses/mit/)
