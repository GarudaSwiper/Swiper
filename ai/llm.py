from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from dotenv import load_dotenv
from langchain_chroma import Chroma

load_dotenv()

prompt = '''
Imagine that you are a mental health professional. You just did an interview with a patient who is experiencing symptoms of mental heath disoders.

Below are the questions you asked the patient.
1. Imagine your mind is like a weather forecast. How would you describe today's forecast for your mental and emotional state? (This imaginative question helps set a comfortable tone and allows the person to express their feelings creatively.)
2. Can you tell me about a recent moment that made you feel really good or really proud of yourself? (Focusing on positive moments can help assess their overall mood and self-esteem.)
3. Can you share a recent experience where you felt disconnected from others or struggled with social interactions? (This addresses potential issues with social withdrawal or isolation.)
4. Is there anything you'd like to share or any resources you feel you might need at this time? (This allows the person to express their emotions.)

Here are the patient's responses:
1. "I feel like a storm is brewing inside me. I'm anxious and overwhelmed."
2. "I recently completed a project at work that I'm really proud of. It was a lot of hard work, but I did it!"
3. "I went to a party last week, but I felt like I didn't belong. I couldn't connect with anyone."
4. "I think I need help. I've been feeling this way for a while, and I don't know how to cope."

Throughout the interview, you noticed that the sequence of the patient's emotion is: ['happy', 'neutral', 'happy', 'neutral', 'neutral']

Based on these datas, Summarize the patient's mental health state by including the key symptomps and abnormal behavior during the interview if any.
'''

model = ChatOpenAI(temperature=0.2)
answer = model.invoke(prompt).content
embeddings = OpenAIEmbeddings()
db = Chroma(persist_directory='ai/vectorstore', embedding_function=embeddings)
answer = db.similarity_search(answer)

print(answer)