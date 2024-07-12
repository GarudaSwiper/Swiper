import librosa
import numpy as np
import pandas as pd
import torch
from torch import nn
import pickle

class AudioClassifier(nn.Module):
    def __init__(self):
        super(AudioClassifier, self).__init__()
        self.fc1 = nn.Linear(45, 64)
        self.fc2 = nn.Linear(64, 128)
        self.fc3 = nn.Linear(128, 256)
        self.fc4 = nn.Linear(256, 6)
        self.dropout = nn.Dropout(0.1)
        self.norm1 = nn.BatchNorm1d(64)
        self.norm2 = nn.BatchNorm1d(128)
    
    def forward(self, x):
        x = self.dropout(torch.relu(self.norm1(self.fc1(x))))
        x = self.dropout(torch.relu(self.norm2(self.fc2(x))))
        x = self.dropout(torch.relu(self.fc3(x)))
        x = torch.log_softmax(self.fc4(x), dim=1)
        return x

def extract_features(file_path):
    y, sr = librosa.load(file_path, sr=None)
    
    # Extract pitch
    f0, voiced_flag, _ = librosa.pyin(y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))
    mean_pitch = np.mean(f0[voiced_flag]) if any(voiced_flag) else 0

    # Extract loudness (RMS)
    rms = librosa.feature.rms(y=y)[0]
    mean_rms = np.mean(rms)

    # Extract Zero Crossing Rate
    zcr = librosa.feature.zero_crossing_rate(y=y)[0]
    mean_zcr = np.mean(zcr)

    # Extract MFCCs and their deltas
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    delta_mfccs = librosa.feature.delta(mfccs)
    delta_delta_mfccs = librosa.feature.delta(mfccs, order=2)
    
    mean_mfccs = np.mean(mfccs, axis=1)
    mean_delta_mfccs = np.mean(delta_mfccs, axis=1)
    mean_delta_delta_mfccs = np.mean(delta_delta_mfccs, axis=1)

    # Extract Spectral Features
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
    spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)[0]
    spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)[0]

    mean_spectral_centroid = np.mean(spectral_centroid)
    mean_spectral_bandwidth = np.mean(spectral_bandwidth)
    mean_spectral_contrast = np.mean(spectral_contrast)
    
    return np.concatenate([
        mean_mfccs, mean_delta_mfccs, mean_delta_delta_mfccs,
        [mean_pitch, mean_rms, mean_zcr, mean_spectral_centroid, mean_spectral_bandwidth, mean_spectral_contrast]
    ])

def create_model():
    model = torch.load('server/speech_emotion_model.pt')
    return model

def extract_tone(file_path):
    features = [extract_features(file_path)]
    with open('server/scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)
    features = scaler.transform(features)
    features = torch.tensor(features).float()
    features = features
    
    model = create_model()
    model.eval()
    with torch.no_grad():
        output = model(features)
    
    index = torch.argmax(output, 1)
    classes = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad']
    
    return classes[index]