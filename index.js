#!/usr/bin/env node

require('dotenv').config()

const Web3 = require('web3')
const Twitter = require('twitter')

const {
  TWITTER_API_KEY,
  TWITTER_API_SECRET_KEY,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET } = process.env

console.log({
  TWITTER_API_KEY,
  TWITTER_API_SECRET_KEY,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET })

const twitterClient = new Twitter({
  consumer_key: TWITTER_API_KEY,
  consumer_secret: TWITTER_API_SECRET_KEY,
  access_token_key: TWITTER_ACCESS_TOKEN,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
})

const params = {screen_name: "nodejs"}

twitterClient.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (error) {
    console.log("ERROR?", error)
  } else {
    console.log(tweets)
  }
})

const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.WSURL))

const subscription = web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
  if (error) return console.error(error)

  console.log('Successfully subscribed!', blockHeader)
}).on('data', (blockHeader) => {
  console.log('data: ', blockHeader)
})

// unsubscribes the subscription
/*
subscription.unsubscribe((error, success) => {
  if (error) return console.error(error);

  console.log('Successfully unsubscribed!');
}); */
