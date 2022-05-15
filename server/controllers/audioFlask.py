import numpy as np
import pandas as pd
import librosa
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense,Dropout,Activation
import base64
from flask import Flask, request, jsonify
import json


app = Flask(__name__)

@app.route('/audioRoute', methods = ['POST'])
def audioDetect():
 data = request.get_json()
 audio_data = data['message']
 audio_data = audio_data[35:]
 audio_data = audio_data.encode('utf-8')
 
 with open('audio.wav', 'wb') as f:
  f.write(base64.b64decode(audio_data))
 mfcc = 128

 def features_extractor(file_name):
  audio, sample_rate = librosa.load(file_name, res_type='kaiser_fast') 
  mfccs_features = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=mfcc)
  mfccs_scaled_features = np.mean(mfccs_features.T,axis=0)
  return mfccs_scaled_features


 model=Sequential()
 model.add(Dense(128,input_shape=(mfcc,)))
 model.add(Dense(128,activation='relu'))
 model.add(Dense(128,activation='relu'))
 model.add(Dropout(0.5))
 model.add(Dense(128,activation='relu'))
 model.add(Dense(128,activation='relu'))
 model.add(Dense(128,activation='relu'))
 model.add(Dropout(0.5))
 model.add(Dense(2))
 model.add(Activation('softmax'))

 model.compile(loss='binary_crossentropy',metrics=['accuracy'],optimizer='adam')
 model.load_weights("Audio_Classifier.h5")


     
 a,b = librosa.load("audio.wav", res_type='kaiser_fast') 

 mfccs_features = librosa.feature.mfcc(y=a, sr=b, n_mfcc=mfcc)
 mfccs_scaled_features = np.mean(mfccs_features.T,axis=0)
 x=[]
 x.append([mfccs_scaled_features])
 xdf=pd.DataFrame(x,columns=['feature'])
 x=np.array(xdf['feature'].tolist())
 y1=model.predict(x)
 print(y1[0][0])
 final_result=float(y1[0][0])
 return json.dumps({"result":final_result})
 
if __name__ == "__main__":
 app.run(port=8005)