'''For more production ready code'''

# 1. Get input text
with open('data/input_text.txt', 'r') as file:
    input_text = file.read()

with open('data/input_text.txt', 'r') as file:
    input_text2 = file.read()

# print(input_text)

# 1.5 Text split using OpenAI tiktoken function
# Note: note sure if this is optimal because it's not really splitting them, but i guess we can concatenate them?
# from langchain.text_splitter import CharacterTextSplitter
# text_splitter = CharacterTextSplitter.from_tiktoken_encoder(chunk_size=100, chunk_overlap=0)
# # documents = text_splitter.create_documents([input_text, input_text])
# texts = text_splitter.split_text(input_text + input_text2)
# print(len(texts))

# ? Using vector store indexes
# from gpt_index import GPTSimpleVectorIndex, SimpleDirectoryReader
# documents = SimpleDirectoryReader('data').load_data()
# index = GPTSimpleVectorIndex(documents)
# # save to disk
# index.save_to_disk('indices/index.json')
index.query("<question_text>?", child_branch_factor=1)


# 2. Create embeddings for language model
# from langchain.embeddings import OpenAIEmbeddings

# embeddings = OpenAIEmbeddings()

# text = "This is a test document."

# # usually for search query embeddings
# query_result = embeddings.embed_query(text)

# # usually for document embeddings
# doc_result = embeddings.embed_documents([text])

# print(query_result, doc_result)

# 3. Somehow be able to use that input text into the model


# 4. Be able to ask that model with the context questions somehow


