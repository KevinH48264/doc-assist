from gpt_index import GPTSimpleVectorIndex, SimpleDirectoryReader
from gpt_index import GPTListIndex, GoogleDocsReader
import os
from dotenv import load_dotenv
load_dotenv()
openai_api_key = os.getenv('OPENAI_API_KEY')

def save_text_to_dir(text, model_index):
    print('saving')
    folder_path = 'data/text_{}'.format(model_index)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    with open('data/text_{}/text.txt'.format(model_index), 'w') as f:
        f.write(text)

def embed(model_index):
    print("embed")
    if not os.path.exists('indices'):
        os.makedirs('indices')

    documents = SimpleDirectoryReader('data/text_{}'.format(model_index)).load_data()
    print('c')
    index = GPTSimpleVectorIndex(documents)
    print('d')
    index.save_to_disk('indices/index_{}.json'.format(model_index))
    print('e')

# queries 
def query(question, model_index, type):
    print("query", question, model_index, type)
    if type == "text":
        index = GPTSimpleVectorIndex.load_from_disk('indices/index_{}.json'.format(model_index))
    elif type =="url":
        index = GPTListIndex.load_from_disk('indices/index_{}.json'.format(model_index))
    response = index.query(question, verbose=True)
    print("response: ", response)
    return response

def embed_google_docs(document_ids, model_index):
    # make sure credentials.json file exists
    '''document_ids = ["<document_id>"]'''
    document_ids_extracted = []
    for id in document_ids:
        start_idx = id.find('/document/d/')
        end_idx = id.find('/edit')
        if start_idx and end_idx:
            document_ids_extracted += [id[start_idx + 12:end_idx]]
    print('document_ids_extracted', document_ids_extracted)
    documents = GoogleDocsReader().load_data(document_ids=document_ids_extracted)
    index = GPTListIndex(documents)
    index.save_to_disk('indices/index_{}.json'.format(model_index))

# test_document_id = ["https://docs.google.com/document/d/1rgHsWyuHWIF9Z8M2I-ceCwnOgiIofvwa2rr1iDhPg94/edit?usp=sharing"]
# # embed_google_docs(test_document_id, 1)
# print(query("what are the main takeaways?", 1))