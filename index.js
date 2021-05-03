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
  CONTRACT_ADDRESS,
  CONTRACT_EVENTS } = process.env

const CONTRACT_EVENTS_ARRAY = CONTRACT_EVENTS.split(',')
const Web3 = require('web3')
const Twitter = require('twitter')
const restClient = require('node-rest-client-promise').Client()
const axios = require('axios')
const web3 = new Web3(new Web3.providers.WebsocketProvider(WSURL))

const twitterClient = new Twitter({
  consumer_key: TWITTER_API_KEY,
  consumer_secret: TWITTER_API_SECRET_KEY,
  access_token_key: TWITTER_ACCESS_TOKEN,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
})

async function postToTwitter(event) {
  const msg = eval('`'+ TWITTER_MESSAGE_TEMPLATE + '`') // can replace this with message template
  let opts = { status: msg }

  // If you always use an image you can use `if (true)` here or remove conditional
  if (TWITTER_MESSAGE_TEMPLATE.indexOf('metadata.data.image') >= 0) {
    const img_url = event.metadata.data.image
    
    // get png binary data
		const result = await axios.request({
			responseType: 'arraybuffer',
			url: img_url,
			method: 'get',
			headers: {
        'Content-Type': 'image/png', // if the image type changes this too
			},
    })

    const data = result.data
    const uploadResult = await twitterClient.post('media/upload', { media: data})
    const media_id = uploadResult.media_id
    opts = { status: msg, media_ids: media_id }
  }

  return twitterClient.post('statuses/update', opts, function(error, tweet, response) {
      if (error) return console.log(JSON.stringify(error))
  })
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
      if (CONTRACT_EVENTS_ARRAY.includes(event.event) && event.transactionHash !== lastHash) {
        lastHash = event.transactionHash // dedupe
        postToTwitter(event)
      }
		})
		.on('error', console.error)
}

eventQuery()
