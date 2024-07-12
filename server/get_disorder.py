from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from dotenv import load_dotenv
from langchain_chroma import Chroma
from typing import List

load_dotenv()

def get_prompt(transcript: str, emotions: List, tone: str):
    prompt = f'''
    Imagine that you are a mental health professional. You just did an interview with a patient who is experiencing symptoms of mental heath disoders.

    Below are the questions you asked the patient.
    1. Imagine your mind is like a weather forecast. How would you describe today's forecast for your mental and emotional state? (This imaginative question helps set a comfortable tone and allows the person to express their feelings creatively.)
    2. Can you tell me about a recent moment that made you feel really good or really proud of yourself? (Focusing on positive moments can help assess their overall mood and self-esteem.)
    3. Can you share a recent experience where you felt disconnected from others or struggled with social interactions? (This addresses potential issues with social withdrawal or isolation.)
    4. Is there anything you'd like to share or any resources you feel you might need at this time? (This allows the person to express their emotions.)

    Here are the patient's responses: {transcript}

    Throughout the interview, you noticed that the sequence of the patient's emotion is: {str(emotions)}
    
    You also noticed that the patient's tone of voice is: {tone}

    Based on these datas, Summarize the patient's mental health state by including the key symptomps and abnormal behavior during the interview if any in at most 50 words.
    
    End your answer with 'Which mental health disorder do you think the patient is experiencing?'
    '''
    
    return prompt

def get_mental_health_disorder(prompt: str):
    model = ChatOpenAI(temperature=0.2)
    answer = model.invoke(prompt).content
    embeddings = OpenAIEmbeddings()
    db = Chroma(persist_directory='server/vectorstore', embedding_function=embeddings, collection_name='mental_health_disorders')
    answer = db.similarity_search(answer)
    return answer[0].metadata['title']