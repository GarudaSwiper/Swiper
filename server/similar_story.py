from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from dotenv import load_dotenv
from langchain_chroma import Chroma
from const.stories import stories
load_dotenv()

def get_similar_story(story: str):
    global stories
    
    model = ChatOpenAI(temperature=0.2)
    answer = model.invoke(story).content
    embeddings = OpenAIEmbeddings()
    db = Chroma(persist_directory='server/vectorstore', embedding_function=embeddings, collection_name='stories')
    answer = db.similarity_search(answer)
    indexes = [ans.metadata['id'] - 1 for ans in answer]
    
    similar_story = [stories[index] for index in indexes]
    
    return similar_story