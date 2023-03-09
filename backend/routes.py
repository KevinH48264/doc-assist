import os
import sseclient
import requests

MAX_CHAT_SIZE = 4000

openai_api_key = os.getenv('OPENAI_API_KEY')

def chat_openai_stream(question="Tell me to ask you a prompt", website="", chat_history=[]):
    print("chatting openai in routes!")

    # define prompt
    prompt = question
    if website:
        prompt = "Given this information: " + website[:MAX_CHAT_SIZE - len(question)] + ", respond conversationally to this prompt: " + question

    # define message conversation for model
    if chat_history:
        messages = chat_history
    else:
        messages = [
            {"role": "system", "content": "You are a helpful assistant, a large language model trained by OpenAI. Answer as concisely as possible. If you're unsure of the answer, say 'Sorry, I don't know'"},
        ]
    messages.append({"role": "user", "content": prompt})


    # create the chat completion
    reqURL = 'https://api.openai.com/v1/chat/completions'
    reqHeaders = {
        'Accept': 'text/event-stream',
        'Authorization': 'Bearer ' + openai_api_key
    }
    reqBody = {
        'model': 'gpt-3.5-turbo',
        'messages': messages,
        'stream': True,
        'temperature': 0.2
    }

    # updated conversation history
    request = requests.post(reqURL, stream=True, headers=reqHeaders, json=reqBody)
    # client = sseclient.SSEClient(request) # creates a generator

    print("request", request)

    # TODO: update on frontend side when DONE token is hit to append placeholder to messages
    # messages.append({"role": "assistant", "content": text_answer})

    return request, messages

# client, messages = chat_openai_stream(question = "Are you still here?", website="The most famous Egyptian pyramids are those found at Giza, on the outskirts of Cairo. Several of the Giza pyramids are counted among the largest structures ever built.[9] The Pyramid of Khufu is the largest Egyptian pyramid. It is the only one of the Seven Wonders of the Ancient World still in existence, despite its being the oldest wonder by about 2,000 years.[10]")

# for event in client.events():
#     if event.data != '[DONE]' and 'content' in json.loads(event.data)['choices'][0]["delta"]:
#         # print(event.data)
#         print(json.loads(event.data)['choices'][0]["delta"]["content"], end="", flush=True)
