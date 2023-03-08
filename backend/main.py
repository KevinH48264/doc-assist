from flask import Flask, Response, render_template, jsonify, request
from flask_cors import CORS, cross_origin
import routes as routes

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
url = "http://0.0.0.0:8080/"

# Health check route
@app.route("/isalive")
def is_alive_function():
    print("/isalive request")
    status_code = Response(status=200)
    return status_code

@app.route('/embed', methods=['POST'])
def embed_function():
  '''
  input_dict = {
    'text' : text,
    'urls' : urls,
    'model_index' : model_index,
    'openai_key' : openai_key
  }
  '''
  print("embedding context")
  data = request.get_json()
  print(data)

  # TODO: update model_index to where it's just the next available number
  if 'model_index' in data.keys():
    model_index = data['model_index']
  else:
    model_index = 0

  if 'openai_key' in data.keys():
    openai_key = data['openai_key']
  else:
    openai_key = ""

  if 'text' in data.keys():
    text = data['text']
    routes.save_text_to_dir(text, model_index)
    routes.embed(model_index, openai_key)
  if 'urls' in data.keys():
    urls = data['urls']
    routes.embed_google_docs(urls, model_index)

  response = jsonify({
    'model_index' : model_index
  })
  response.headers.add('Access-Control-Allow-Origin', '*')

  return response

@app.route('/query', methods=['POST'])
def query_function():
  '''
  input_dict = {
    'model_index' : model_index,
    'prompt' : prompt
  }
  '''
  print("querying")

  data = request.get_json()
  model_index = data['model_index']
  prompt = data['prompt']
  type = data['type']

  res = routes.query(prompt, model_index, type)

  response = jsonify({'Response' : res})
  response.headers.add('Access-Control-Allow-Origin', '*')
  return response

@app.route('/chat', methods=['POST'])
def chat_function():
  '''
  input_dict = {
    'website_text' : website_text,
    'prompt' : prompt,
    'chat_history' : chat_history
  }
  '''
  print("chatting")

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

@app.route('/chat_stream', methods=['POST'])
def chat_function():
  '''
  input_dict = {
    'website_text' : website_text,
    'prompt' : prompt,
    'chat_history' : chat_history
  }
  '''
  print("chatting")

  data = request.get_json()

  website_text, prompt, chat_history = "", "", []

  if 'website_text' in data.keys():
    website_text = data['website_text']
  if 'prompt' in data.keys():
    prompt = data['prompt']
  if 'chat_history' in data.keys():
    chat_history = data['chat_history']

  res_answer_generator, res_messages = routes.chat_openai_stream(prompt, website_text, chat_history)

  response = jsonify({
    'Response' : res_answer_generator, 
    'Messages' : res_messages # potentially don't need to return this and store messages in front end
  })
  response.headers.add('Access-Control-Allow-Origin', '*')
  return response

@app.route('/')
def index_function():
  print("RUNNING APP!")

  return jsonify({})

if __name__ == "__main__":
  app.run(debug=True, host="0.0.0.0", port=8080)