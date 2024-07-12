from langchain_community.chat_models import ChatOpenAI
from langchain_chroma import Chroma
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.embeddings import OpenAIEmbeddings
from const.stories import stories
import dotenv

dotenv.load_dotenv()

embeddings = OpenAIEmbeddings()
documents = []

def initialize_knowledge():
    text_splitter = CharacterTextSplitter(separator='\n', chunk_size=100, chunk_overlap=50)
    
    with open('server/const/bipolar.txt') as f:
        bipolar = f.read()
        bipolar = text_splitter.create_documents([bipolar])
        for i in range(len(bipolar)):
            bipolar[i].metadata = {
                'title': 'Bipolar',
            }
        documents = documents + bipolar

    with open('server/const/depression.txt') as f:
        depression = f.read()
        depression = text_splitter.create_documents([depression])
        for i in range(len(depression)):
            depression[i].metadata = {
                'title': 'Depression',
            }
        documents = documents + depression

    with open('server/const/anxiety.txt') as f:
        anxiety = f.read()
        anxiety = text_splitter.create_documents([anxiety])
        for i in range(len(anxiety)):
            anxiety[i].metadata = {
                'title': 'Anxiety',
            }
        documents = documents + anxiety

    with open('server/const/ptsd.txt') as f:
        ptsd = f.read()
        ptsd = text_splitter.create_documents([ptsd])
        for i in range(len(ptsd)):
            ptsd[i].metadata = {
                'title': 'PTSD',
            }
        documents = documents + ptsd

    vectorstore = Chroma.from_documents(documents, embeddings, persist_directory='server/vectorstore', collection_name='mental_health_disorders')
    return vectorstore

def initialize_story():
    global stories
    text_splitter = CharacterTextSplitter(separator='\n')
    stories = [story['description'] for story in stories]
    stories = text_splitter.create_documents(stories)
    for story in stories:
        story.metadata = {
            'id': stories.index(story) + 1,
        }
    vectorstore = Chroma.from_documents(stories, embeddings, persist_directory='server/vectorstore', collection_name='stories')
    
    return vectorstore

if __name__ == '__main__':
    # initialize_knowledge()
    # initialize_story()
    pass