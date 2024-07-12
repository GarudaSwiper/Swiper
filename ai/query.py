from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_community.embeddings import OpenAIEmbeddings
from dotenv import load_dotenv

load_dotenv()
embeddings = OpenAIEmbeddings() 
db = Chroma(persist_directory='ai/vectorstore', embedding_function=embeddings)

def query(text):
    docs = db.similarity_search(text)
    return docs

if __name__ == "__main__":
    text = "Sometimes I feel so sad and lonely. But Sometimes I feel so happy and excited. I don't know what to do."
    docs = query(text)
    
    print(docs)