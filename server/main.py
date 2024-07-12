# Import pipeline flow
from video_splitter import extract_all
from emotion import extract_emotion
from get_disorder import get_mental_health_disorder, get_prompt
from chroma_init import initialize_knowledge, initialize_story
from tone_analyzer import extract_tone
from similar_story import get_similar_story
# Import FastAPI
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from const.plan import *

app = FastAPI()

origins = [
    'https://localhost:8000',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
@app.get("/init/")
async def init():
    initialize_knowledge()
    initialize_story()
    return {"message": "Initialized"}

@app.get("/planner/")
async def create_planner(user_id, file_path: str):
    video_path = f'ai/videos/{file_path}'
    video_name = 'ai/results/frame.mp4'
    audio_path = 'ai/results/audio.wav'
    transcript_path = 'ai/results/transcript.txt'
    
    extract_all(video_path, video_name, audio_path, transcript_path)
    emotions = extract_emotion(video_name)
    tone = extract_tone(audio_path)
    transcript = open(transcript_path, 'r').read()
    
    mental_health_disorder = get_mental_health_disorder(get_prompt(transcript, emotions, tone))
    
    plan = {
        'ptsd': ptsd_plan,
        'depression': depression_plan,
        'anxiety': anxiety_plan,
        'bipolar': bipolar_plan,
    }
    
    return {"plan": plan[mental_health_disorder]}

@app.get("/similar/")
async def get_similar(user_id):
    transcript_path = 'ai/results/transcript.txt'
    transcript = open(transcript_path, 'r').read()
    
    similar_story = get_similar_story(transcript)
    
    return {"similar_story" : similar_story}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)