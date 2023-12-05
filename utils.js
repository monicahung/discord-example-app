import 'dotenv/config';
import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';

export function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf, encoding) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
}

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = `${process.env.DISCORD_ENDPOINT}/v10/${endpoint}`;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8', //might need to get rid of this cookie on not staging
      cookie: 'CF_Authorization=eyJhbGciOiJSUzI1NiIsImtpZCI6ImZhZThmMDhlM2NhZjQyODZhYjA5OWJmOTk4MDJhYjI5YTNhOTc2NWNkM2NkMDYzZDkyZTE5NDc2MWYyYTVhMzUifQ.eyJhdWQiOlsiZTQ4MTJjOWJmMjFlZmMyMGE2ODRhOGI0MmMzNDlkYTcxYWIzM2U2NzkyNzZlZWY5NDNlMTlmODI5ZTkxNzA3NiJdLCJlbWFpbCI6Im1vbmljYS5odW5nQGRpc2NvcmRhcHAuY29tIiwiZXhwIjoxNjk3NTc4ODYxLCJpYXQiOjE2OTc0OTI0NjEsIm5iZiI6MTY5NzQ5MjQ2MSwiaXNzIjoiaHR0cHM6Ly9kaXNjb3JkYXBwY29tLmNsb3VkZmxhcmVhY2Nlc3MuY29tIiwidHlwZSI6ImFwcCIsImlkZW50aXR5X25vbmNlIjoiZzJtN08zM291cGprMFlIeiIsInN1YiI6IjUwZThjOTllLTEwMmUtNDFhNi05Y2NhLTM0NTY1Zjc3M2RhYyIsImNvdW50cnkiOiJVUyJ9.g5VbVYSmKu-JBlsBuWLyOMIJIdaS7OfbTp5OaUY_NYM314i6ZoHhM81t-kJWFcbOjPKh9jp-L0wnfO7Jz-YvR6eBMQzFivoUre5RhQuAiyCcKrEUtSaPW1XQ-MRKnJ9RfKCEr23JJ29l_Y2V-Ncp3ZG1ax0A7EZ7U3Pos-nSdaDRlCtw9a3cfmjrr6AcwJlVy29M14FKbDZnR7-c_QUICuZSfsb9rxizRlR-SqsE7LEN_8jATvPXWCnfHCPTRjwYbG7870VS5MTWctU9sbt0CHDnyeAsmqsd781qu_tUpy3YV7MqIecBTrhfAMI18GHkX5QKQvy--Mgw7QDdTS3cBw'
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    console.log(res.status);
    const data = await res.text()
    console.log(data)
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = ['😭','😄','😌','🤓','😎','😤','🤖','😶‍🌫️','🌏','📸','💿','👋','🌊','✨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
