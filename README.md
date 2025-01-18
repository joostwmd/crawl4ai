## Crawl4AI Playground

This is a playground for the Crawl4AI API.

### Requirements

- Node.js
- Docker Desktop

### Installation

1. Clone the repository
2. Run `npm install`
3. Make a copy of `.env.example` and name it `.env`
4. Add your Crawl4AI API token and OpenAI API key to the `.env` file
5. Run `docker-compose up -d`
6. Run `node crawler.js`

### Error

When trying to use an LLM to extract data from a page, I am getting the following error:

`Error in thread execution: litellm.AuthenticationError: AuthenticationError: OpenAIException - Error code: 401 - {'error': {'message': 'Incorrect API key provided: no-token. You can find your API key at https://platform.openai.com/account/api-keys.', 'type': 'invalid_request_error', 'param': None, 'code': 'invalid_api_key'}}`

I set the `OPENAI_API_KEY` in the `.env` file. I also used Docker desktop to log the environment variables, confirming that the key is correct. The key is also valid, as I can use it in the OpenAI API playground.

I'm not sure what I'm doing wrong.

### My current setup

MacBook Pro 2020, M1, 8GB RAM, Sonoma 14.1
