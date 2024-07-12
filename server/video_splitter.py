# Please run this script from the root directory
# Not from the ai directory

import cv2
import os
from moviepy.editor import VideoFileClip
from dotenv import load_dotenv
from openai import OpenAI
import time

def resize_frame(frame, width, height):
    return cv2.resize(frame, (width, height), interpolation=cv2.INTER_AREA)

def extract_frame(video_path, video_name, fps=30, skip=10):
    interval = fps * skip
    frame_no = 0
    video = cv2.VideoCapture(video_path)
    out_video = cv2.VideoWriter(video_name, cv2.VideoWriter_fourcc(*'mp4v'), fps, (1280, 720))
    
    while True:
        ret, frame = video.read()
        if not ret:
            break
        
        if frame_no % interval == 0:
            frame = resize_frame(frame, 1280, 720)
            out_video.write(frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        frame_no += 1
    
    video.release()
    out_video.release()
    cv2.destroyAllWindows()
        
    return

def extract_audio(video_path, audio_name):
    video_clip = VideoFileClip(video_path)
    video_clip.audio.write_audiofile(audio_name)
    
    return

def extract_transcript(audio_path, transcript_name):
    load_dotenv()
    client = OpenAI()
    
    audio_file = open(audio_path, 'rb')
    transcription = client.audio.transcriptions.create(
        model='whisper-1',
        file=audio_file
    )
    
    with open(transcript_name, 'w') as f:
        f.write(transcription.text)
    
    return 

def extract_all(video_path, video_name, audio_name, transcript_name):
    begin = time.time()
    extract_frame(video_path, video_name)
    extract_audio(video_path, audio_name)
    extract_transcript(audio_name, transcript_name)
    print(f'Elapsed Time: {time.time()-begin}')