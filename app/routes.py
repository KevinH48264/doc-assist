from gpt_index import GPTSimpleVectorIndex, SimpleDirectoryReader
from gpt_index import GPTListIndex, GoogleDocsReader
import re

def save_text_to_dir(text, model_index):
    pass

def embed(model_index):
    documents = SimpleDirectoryReader('data/text_{}'.format(model_index)).load_data()
    index = GPTSimpleVectorIndex(documents)
    index.save_to_disk('indices/index_{}.json'.format(model_index))

# queries 
def query(question, model_index):
    index = GPTSimpleVectorIndex.load_from_disk('indices/index_{}.json'.format(model_index))
    response = index.query(question, verbose=True)
    return response

def embed_google_docs(document_ids, model_index):
    # make sure credentials.json file exists
    '''document_ids = ["<document_id>"]'''
    document_ids_extracted = []
    for id in document_ids:
        match = re.search(r'/document/d/([a-zA-Z0-9-_]+)', id)
        if match:
            document_ids_extracted += [match]
    documents = GoogleDocsReader().load_data(document_ids=document_ids_extracted)
    index = GPTListIndex(documents)
    index.save_to_disk('indices/index_{}.json'.format(model_index))

test_document_id = ["https://docs.google.com/document/d/1rgHsWyuHWIF9Z8M2I-ceCwnOgiIofvwa2rr1iDhPg94/edit?usp=sharing"]
embed_google_docs(test_document_id, 1)
query("what are the main takeaways?", 1)