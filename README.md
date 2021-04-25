# NFT Tweet

Monitors an NFT contract for `Mint` events

## Setup

### Config

* Copy `sample.env` to `.env`
* Generate the appropriate credentials for twitter, etherscan, and infura
* Populate the `.env` file with your credentials

### Twitter message

Use the `TWITTER_MESSAGE_TEMPLATE` value in `.env` to format your tweet.
You will have access to the `event` object (example below).
The value will be interpreted as a string literal and may include variables of format `${event.transactionHash}`

```javascript
{
  removed: false,
  logIndex: 342,
  transactionIndex: 294,
  transactionHash: '0x48378b555048baf27aed8fc7f4e1526a64dd91a2206d0d79690ee77e063ce97e',
  blockHash: '0xd0d3af59b2eca4bff3651ee09417f105756d206a4dd84674893f64fd31bf9dbe',
  blockNumber: 12310282,
  address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  id: 'log_8626df84',
  returnValues: Result {
    '0': '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    '1': '6610245104149876',
    src: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    wad: '6610245104149876'
  },
  event: 'Withdrawal',
  signature: '0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65',
  raw: {
    data: '0x00000000000000000000000000000000000000000000000000177bfb9f4fa574',
    topics: [
      '0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65'
      '0x0000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d'
    ]
  }
}
```

## Running the app

* Use node version 12 (I suggest using [nvm](https://github.com/nvm-sh/nvm))
* Run the app using node:
```
node index.js
```
* You might want to use a tool like [PM2](https://pm2.keymetrics.io/)
* Good luck!
