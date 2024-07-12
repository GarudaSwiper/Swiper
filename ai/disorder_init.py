from langchain_community.chat_models import ChatOpenAI
from langchain_chroma import Chroma
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.embeddings import OpenAIEmbeddings
import dotenv

dotenv.load_dotenv()
embeddings = OpenAIEmbeddings()
text_splitter = CharacterTextSplitter(separator='\n', chunk_size=100, chunk_overlap=50)
documents = []

with open('ai/const/bipolar.txt') as f:
    bipolar = f.read()
    bipolar = text_splitter.create_documents([bipolar])
    for i in range(len(bipolar)):
        bipolar[i].metadata = {
            'title': 'Bipolar',
        }
    documents = documents + bipolar

with open('ai/const/depression.txt') as f:
    depression = f.read()
    depression = text_splitter.create_documents([depression])
    for i in range(len(depression)):
        depression[i].metadata = {
            'title': 'Depression',
        }
    documents = documents + depression

with open('ai/const/anxiety.txt') as f:
    anxiety = f.read()
    anxiety = text_splitter.create_documents([anxiety])
    for i in range(len(anxiety)):
        anxiety[i].metadata = {
            'title': 'Anxiety',
        }
    documents = documents + anxiety

with open('ai/const/ptsd.txt') as f:
    ptsd = f.read()
    ptsd = text_splitter.create_documents([ptsd])
    for i in range(len(ptsd)):
        ptsd[i].metadata = {
            'title': 'PTSD',
        }
    documents = documents + ptsd

vectorstore = Chroma.from_documents(documents, embeddings, persist_directory='ai/vectorstore', collection_name='mental_health_disorders')