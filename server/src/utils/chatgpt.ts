import axios from 'axios'
import { chatGptApiKey } from '../config'

export async function askChatGPT(text: string, apiKey = chatGptApiKey) {
    if (!apiKey) {
        throw Error("process.env.CHATGPT_API_KEY must be set!")
    }

    // use chatgpt default config
    const data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": text}],
        "temperature": 0.7 
    }

    // add api key to headers
    const headers = {'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json'}
    const res = await axios.post('https://api.openai.com/v1/chat/completions', data, {headers})
    const message = res.data?.choices?.[0]?.message?.content
    return message ?? ''
}