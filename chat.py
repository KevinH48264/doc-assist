'''For testing code'''


'''For how to talk to a model'''
# from langchain.llms import OpenAI

# llm = OpenAI(model_name="text-ada-001", n=2, best_of=2)

# llm_result = llm("Tell me a joke")

'''For how to create embeddings'''
# from langchain.embeddings import OpenAIEmbeddings

# embeddings = OpenAIEmbeddings()

# text = "This is a test document."

# # usually for search query embeddings
# query_result = embeddings.embed_query(text)

# # usually for document embeddings
# doc_result = embeddings.embed_documents([text])

# print(query_result, doc_result)

'''For using chains'''
from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI

llm = OpenAI(temperature=0.9)
prompt = PromptTemplate(
    input_variables=["question"],
    template="Answer this question: {question}?",
)

from langchain.chains import LLMChain
chain = LLMChain(llm=llm, prompt=prompt)

# Run the chain only specifying the input variable.
print(chain.run("how do i make kimchi fried rice?"))

'''How to answer two prompts in one run (not as relevant?)'''
second_prompt = PromptTemplate(
    input_variables=["question"],
    template="Respond to this question: {question}",
)
chain_two = LLMChain(llm=llm, prompt=second_prompt)

from langchain.chains import SimpleSequentialChain
overall_chain = SimpleSequentialChain(chains=[chain, chain_two], verbose=True)

# Run the chain specifying only the input variable for the first chain.
catchphrase = overall_chain.run("if I don't have any ingredients in my kitchen, what do I need to buy?")
print(catchphrase)