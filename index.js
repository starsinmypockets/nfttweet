#!/usr/bin/env node

require('dotenv').config()

const {
  TWITTER_API_KEY,
  TWITTER_API_SECRET_KEY,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
  TWITTER_MESSAGE_TEMPLATE,
  WSURL,
  ETHERSCAN_ABI_URL,
  ETHERSCAN_API_KEY,
  CONTRACT_ADDRESS } = process.env

const Web3 = require('web3')
const Twitter = require('twitter')
const restClient = require('node-rest-client-promise').Client();
const web3 = new Web3(new Web3.providers.WebsocketProvider(WSURL))
const twitterClient = new Twitter({
  consumer_key: TWITTER_API_KEY,
  consumer_secret: TWITTER_API_SECRET_KEY,
  access_token_key: TWITTER_ACCESS_TOKEN,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
})

function postToTwitter(transaction_hash) {
  const msg = eval('`'+ TWITTER_MESSAGE_TEMPLATE + '`')
  return twitterClient.post('statuses/update', {status: msg},  function(error, tweet, response) {
      if(error) return console.log(JSON.stringify(error))
  });
}

async function getContractAbi() {
  const url = `${ETHERSCAN_ABI_URL}${CONTRACT_ADDRESS}&apiKey=${ETHERSCAN_API_KEY}`
  const etherescan_response = await restClient.getPromise(url)
  const contract_abi = JSON.parse(etherescan_response.data.result)
  return contract_abi
}

async function eventQuery(){
	const contract_abi = await getContractAbi()
  const contract = new web3.eth.Contract(contract_abi, CONTRACT_ADDRESS)
  let lastHash
	contract.events.allEvents()
		.on('data', (event) => {
      console.log(event)
      if (event.event === 'Deposit' && event.transactionHash !== lastHash) {
        lastHash = event.transactionHash // dedupe
        postToTwitter(event.transactionHash)
      }
		})
		.on('error', console.error)
}

eventQuery()
