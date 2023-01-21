from flask import Flask, Response, render_template, jsonify, request
from flask_cors import CORS, cross_origin
import requests
import retriever as retriever

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
url = "http://0.0.0.0:8080/"

# Health check route
@app.route("/isalive")
def is_alive():
    print("/isalive request")
    status_code = Response(status=200)
    return status_code

@app.route('/embed')
def embed():
  '''should take in documents or Google Drive URL'''
  print("embedding context")

  return jsonify({})

@app.route('/query')
def query():
  '''should take in a model index id'''
  print("embedding context")

  return jsonify({})

@app.route('/')
def index():
  print("RUNNING APP!")

  return jsonify({})

if __name__ == "__main__":
  app.run(debug=True, host="0.0.0.0", port=8080)