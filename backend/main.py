from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import routes as routes
from PyPDF2 import PdfReader
import requests
import os

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
url = "http://0.0.0.0:8080/"

# Health check route
@app.route("/isalive")
def is_alive_function():
  print("isalive request")
  return {"is alive": "true"}

@app.route("/pdf2text", methods=['POST'])
def pdf2text_function():
  data = request.get_json()
  print(data)
  url = None
  if "url" in data.keys():
    url = data["url"]

  if not url:
    return {"text": ""}

  if (url.startswith("file://")):
    if (url.startswith("file:///C:")):
      abs_path = url[8:]
    else:
      abs_path = url[7:]

    abs_path = abs_path.replace('%20', ' ')
    reader = PdfReader(abs_path)
  else:
    response = requests.get(url)
    with open('file.pdf', 'wb') as f:
        f.write(response.content)
        reader = PdfReader('./file.pdf')

  # summarize the page you're on
  text = ""
  for i in range(4):
    page = reader.pages[i]
    text += page.extract_text()

  return {"text": text}

# chatting with no stream
@app.route('/chat', methods=['POST'])
def chat_function():
  '''
  input_dict = {
    'website_text' : website_text,
    'prompt' : prompt,
    'chat_history' : chat_history
  }
  '''
  print("chatting, no stream")

  data = request.get_json()

  website_text, prompt, chat_history = "", "", []

  if 'website_text' in data.keys():
    website_text = data['website_text']
  if 'prompt' in data.keys():
    prompt = data['prompt']
  if 'chat_history' in data.keys():
    chat_history = data['chat_history']

  res_answer, res_messages = routes.chat_openai(prompt, website_text, chat_history)

  response = jsonify({
    'Response' : res_answer, 
    'Messages' : res_messages
  })
  response.headers.add('Access-Control-Allow-Origin', '*')
  return response

# chatting with stream
@app.route('/chat_stream', methods=['POST'])
def chat_stream_function():
  '''
  input_dict = {
    'website_text' : website_text,
    'prompt' : prompt,
    'chat_history' : chat_history
  }
  '''

  data = request.get_json()

  website_text, prompt, chat_history = "", "", []

  if 'website_text' in data.keys():
    website_text = data['website_text']
  if 'prompt' in data.keys():
    prompt = data['prompt']
  if 'chat_history' in data.keys():
    chat_history = data['chat_history']
  res_answer_generator, res_messages = routes.chat_openai_stream(prompt, website_text, chat_history)

  return Response(res_answer_generator, mimetype='text/event-stream')

@app.route('/')
def index_function():
  print("RUNNING APP!")
  return jsonify({})

if __name__ == "__main__":
  app.run(debug=True, host="0.0.0.0", port=8080)