# NFT Tweet

Monitors an NFT contract for `Mint` events

## Setup

### Config

* Copy `sample.env` to `.env`
* Generate the appropriate credentials for twitter, etherscan, and infura
* Populate the `.env` file with your credentials

### Twitter message

Use the `TWITTER_MESSAGE_TEMPLATE` value in `.env` to format your tweet.
If you need access to additional variables please open an issue or submit a pull request.

## Running the app

* Use node version 10 (I suggest using [nvm](https://github.com/nvm-sh/nvm)
* Runing the app using node:
```
node index.js
```
* You might want to use a tool like [PM2](https://pm2.keymetrics.io/)
* Good luck!
