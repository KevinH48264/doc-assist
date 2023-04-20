# import langchain.document_loaders as dl
import json
import os

import pinecone
import requests
import routes as routes
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from langchain.chains import VectorDBQAWithSourcesChain
from langchain.chat_models import ChatOpenAI
from PyPDF2 import PdfReader
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Pinecone
# from utils import make_chain

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
url = "http://0.0.0.0:8081/"

# Health check route
@app.route("/isalive")
def is_alive_function():
  print("isalive request")
  return {"is alive": "true"}

@app.route("/pdf2text", methods=['POST'])
def pdf2text_function():
  data = request.get_json()
  url = None
  print("Data", data)
  if "url" in data.keys():
    url = data["url"]
  namespace = url
  url = url.replace("%20", " ")
  abs_path = url[7:]
  print("BEFORE")
  loader = PyPDFLoader(abs_path)
  print("AFTER")
  rawDocs = loader.load()

  # print("raw docs", rawDocs)
  textSplitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
  )
  docs = textSplitter.split_documents(rawDocs)

  embeddings = OpenAIEmbeddings()

  pinecone.init(api_key=os.getenv("PINECONE_API_KEY"), environment=os.getenv("PINECONE_ENVIRONMENT"))
  index_name = "pdgp"

  docsearch = Pinecone.from_documents(docs, embeddings, index_name=index_name, namespace=namespace)

  return {"test": "test"}


@app.route("/pdf2text2", methods=['POST'])
def pdf2text2_function():
  data = request.get_json()
  print(data)
  url = None
  if "url" in data.keys():
    url = data["url"]

  if not url:
    return {"text": ""}

  if (url.startswith("file://")):
    url = url.replace("%20", " ")
    abs_path = url[7:]
    reader = PdfReader(abs_path)
  elif (url.startswith("C:")):
    url = url.replace("%20", " ")
    abs_path = url[2:]
    reader = PdfReader(abs_path)
  else:
    response = requests.get(url)
    with open('file.pdf', 'wb') as f:
        f.write(response.content)
        reader = PdfReader('./file.pdf')

  text = ""
  for i in range(1,6):
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


# # chatting with stream
# @app.route('/chat_stream', methods=['POST'])
# def chat_stream_function():
#   '''
#   input_dict = {
#     'website_text' : website_text,
#     'prompt' : prompt,
#     'chat_history' : chat_history
#   }
#   '''

#   data = request.get_json()
#   print("chatting, stream", data)

#   website_text, prompt, chat_history = "", "", []

#   if 'website_text' in data.keys():
#     website_text = data['website_text']
#   if 'prompt' in data.keys():
#     prompt = data['prompt']
#     prompt = prompt = prompt.strip().replace('\n', ' ')
#   if 'chat_history' in data.keys():
#     chat_history = data['chat_history']
#   if 'namespace' in data.keys():
#     namespace = data['namespace']

#   # !! Add namespace as an argument
#   embeddings = OpenAIEmbeddings()
#   vectorstore = Pinecone.from_existing_index(index_name="pdgp", embedding=embeddings, namespace="namespace")
#   llm = ChatOpenAI(
#     openai_api_key=os.getenv("OPENAI_API_KEY"),
#     model_name='gpt-3.5-turbo',
#     temperature=0.0
#   )
#   qa_with_sources = VectorDBQAWithSourcesChain.from_chain_type(
#     llm=llm,
#     chain_type="stuff",
#     vectorstore=vectorstore
#   )
#   response = qa_with_sources(prompt)
#   print("response", response)

#   # def send_data(data):
#   #   res = Response(f"data: {data}\n", mimetype="text/event-stream")
#   #   res.headers["Cache-Control"] = "no-cache"
#   #   return res

#   return response
#   # return Response(response, mimetype='text/event-stream')

#   # chain = make_chain(vectorstore, lambda token: send_data(json.dumps({"data": token})))
#   # print("chain made", chain)
#   # # response = chain.call()
#   # res_answer_generator, res_messages = routes.chat_openai_stream(prompt, website_text, chat_history)

#   # return Response(res_answer_generator, mimetype='text/event-stream')


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
  print("chatting with stream!")

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
  app.run(debug=True, host="0.0.0.0", port=8081)