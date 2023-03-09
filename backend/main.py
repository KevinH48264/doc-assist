from flask import Flask, Response, render_template, jsonify, request
from flask_cors import CORS, cross_origin
import routes as routes
import json
import sseclient

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
url = "http://0.0.0.0:8080/"

# temporary holder
generator_exists = False

# Health check route
@app.route("/isalive")
def is_alive_function():
    print("/isalive request")
    status_code = Response(status=200)
    return status_code

# @app.route('/chat', methods=['POST'])
# def chat_function():
#   '''
#   input_dict = {
#     'website_text' : website_text,
#     'prompt' : prompt,
#     'chat_history' : chat_history
#   }
#   '''
#   print("chatting")

#   data = request.get_json()

#   website_text, prompt, chat_history = "", "", []

#   if 'website_text' in data.keys():
#     website_text = data['website_text']
#   if 'prompt' in data.keys():
#     prompt = data['prompt']
#   if 'chat_history' in data.keys():
#     chat_history = data['chat_history']

#   res_answer, res_messages = routes.chat_openai(prompt, website_text, chat_history)

#   response = jsonify({
#     'Response' : res_answer, 
#     'Messages' : res_messages
#   })
#   response.headers.add('Access-Control-Allow-Origin', '*')
#   return response

@app.route('/chat_stream', methods=['POST'])
def chat_function():
  '''
  input_dict = {
    'website_text' : website_text,
    'prompt' : prompt,
    'chat_history' : chat_history
  }
  '''
  print("chatting route called")

  data = request.get_json()

  website_text, prompt, chat_history = "", "", []

  if 'website_text' in data.keys():
    website_text = data['website_text']
  if 'prompt' in data.keys():
    prompt = data['prompt']
  if 'chat_history' in data.keys():
    chat_history = data['chat_history']

  # website_text = request.args.get('websitetext')
  # prompt = request.args.get('prompt')

  print("values: ", website_text, prompt, chat_history)

  # res_answer_generator = sseclient.SSEClient('')
  res_answer_generator, res_messages = routes.chat_openai_stream(prompt, website_text, chat_history)
  # generator_exists = True

  # res_answer = ""
  # print("going to print out stuff", res_answer_generator)

  # def generate():
  #     for event in res_answer_generator.events():
  #         yield event.data

  # # for event in res_answer_generator.events():
  # #   if event.data != '[DONE]' and 'content' in json.loads(event.data)['choices'][0]["delta"]:
  # #       # print(event.data)
  # #       res_answer += json.loads(event.data)['choices'][0]["delta"]["content"]
  # #       # print(json.loads(event.data)['choices'][0]["delta"]["content"], end="", flush=True)

  print("finished", type(res_answer_generator))
  return Response(res_answer_generator, mimetype='text/event-stream')
  # response = jsonify({
  #   'Answer' : res_answer,
  #   'Response' : res_answer_generator, 
  #   'Messages' : res_messages # potentially don't need to return this and store messages in front end
  # })
  # response.headers.add('Access-Control-Allow-Origin', '*')
  # return response

# @app.route('/stream')
# def stream():
#   if generator_exists:
#     global res_answer_generator

#     print("going to print out stuff", res_answer_generator)

#     def generate():
#         for event in res_answer_generator.events():
#             yield event.data

#     print("finished")
#     return Response(generate(), mimetype='text/event-stream')
#   return

@app.route('/')
def index_function():
  print("RUNNING APP!")

  return jsonify({})

if __name__ == "__main__":
  app.run(debug=True, host="0.0.0.0", port=8080)