from video_splitter import extract_all
from emotion import extract_emotion

if __name__ == "__main__":
    # Extract the video's frames, audio, and transcript
    # @ Frame extraction for emotion detection
    # @ Audio extraction for transcription
    # @ Transcript extraction for sentiment analysis
    
    video_path = 'ai/videos/_Kevin Surace- 1 Minute Ted Talk.mp4'
    video_name = 'ai/results/frame.mp4'
    audio_name = 'ai/results/audio.wav'
    transcript_name = 'ai/results/transcript.txt'
    
    print('Extracting video frames, audio, and transcript...')
    extract_all(video_path, video_name, audio_name, transcript_name)
    print('Extracting emotion from video...')
    emotions = extract_emotion(video_name)
    print('Extracting body movement from video...')