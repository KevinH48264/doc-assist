from flask import Flask, Response, jsonify, request
from flask_cors import CORS
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
  print("chatting, with stream")

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