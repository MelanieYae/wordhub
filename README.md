# wordhub

## Requirementes
[NodeJS18](https://nodejs.org/en/download)

## Setup

#### Install dependencies
server
```
cd server
npm install -D
```
client
```
cd client
npm install -D
```

#### Config server
copy `server/.env.example` into `server/.env`

Register at [OpenAI](https://platform.openai.com/)

Add [payment method](https://platform.openai.com/account/billing/payment-methods)

Grab [API keys](https://platform.openai.com/account/api-keys)

Paste the API key in the `.env` file `CHATGPT_API_KEY="<api key>"`

#### Config Database
npx prisma generate # generate Database objects
npx prisma db push # create tables in database

#### Run it
server
```
npm start
```
client
```
npm run dev
```
