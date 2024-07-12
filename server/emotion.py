import cv2
import time
from fer import FER

def extract_emotion(video_path):
    begin = time.time()
    video_path = 'server/results/frame.mp4'
    cap = cv2.VideoCapture(video_path)
    detector = FER()
    emotions = []
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        result = detector.top_emotion(frame)
        if result[0]: 
            emotions.append(result[0])
    
    cap.release()
    cv2.destroyAllWindows()    
    
    print(f'Elapsed Time: {time.time()-begin}')  
    return emotions