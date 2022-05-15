import matplotlib.pyplot as plt
import os
import re
import shutil
import string
import pandas as pd
import sklearn.model_selection as skl
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sentence_transformers import SentenceTransformer
from tensorflow.keras import Sequential, layers
from tensorflow import keras
from keras.models import load_model
import tensorflow as tf
from flask import Flask, request
import json
import librosa
import numpy as np
import base64
from keras_preprocessing.image import ImageDataGenerator
from keras.preprocessing import image
from keras.models import Sequential
from tensorflow.keras import regularizers
from keras.layers import Conv2D, AvgPool2D, Flatten, Dense, InputLayer, BatchNormalization, Dropout
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense,Dropout,Activation

import sys
import base64

from io import BytesIO
from PIL import Image


app = Flask(__name__)

@app.route('/textRoute', methods = ['POST'])
def textDetect():
 data = request.get_json()
 message = data['message']
 
 df = np.array([message]) 

 bert_model = SentenceTransformer('sentence-transformers/paraphrase-albert-small-v2')
 sentence = bert_model.encode(df, show_progress_bar=True)

 textModel = load_model('Text_Classifier.h5')

 classifier = keras.models.load_model('Text_Classifier.h5')
 hist = classifier.predict(sentence)

 print(hist)
 return json.dumps({"result":1-hist[0][0]})

@app.route('/imageRoute', methods = ['POST'])
def imageDetect():
 data = request.get_json()
 img_data = data['message']
 
 imageModel = Sequential()
 imageModel.add(InputLayer(input_shape=(48, 48, 3)))
 imageModel.add(Conv2D(32, kernel_size=2, padding='same'))
 imageModel.add(Flatten())
 imageModel.add(Dense(2,	activation='softmax'))
 imageModel.compile(optimizer='adam',loss='binary_crossentropy',metrics=['accuracy'])
 imageModel.load_weights('Image_Classifier.h5')
 
 
 img_data = img_data.encode('utf-8')
 
 
 with open('image.jpg', 'wb') as f:
  f.write(base64.b64decode(img_data))
	
 path = 'image.jpg'
 img = image.load_img(path, target_size=(48, 48))
 x = image.img_to_array(img)
 x = np.expand_dims(x, axis=0)
 x = np.vstack([x])
 cl = imageModel.predict(x)
 x = float(cl[0][0])
 return json.dumps({"result":x})
 
if __name__ == '__main__':
 app.run(port=8000, threaded=True)