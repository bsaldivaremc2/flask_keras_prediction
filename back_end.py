from flask import Flask, request, Response, jsonify, make_response, current_app, send_from_directory
import json
import numpy as np
import tensorflow as tf
import os
os.environ['KERAS_BACKEND'] = 'tensorflow'

import keras
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import BatchNormalization
from keras.models import load_model


keras_model_name = 'keras_model.h5'

app = Flask(__name__)

@app.route('/KerasModelHist', methods=['POST'])
def happy_sad_6():
 rf=request.form
 dd = receive_image(rf)
 if dd['msg']=='Clear':
  #print(dd['inference'])
  inference = list(dd['inference'].flatten())
  inference = list(map(lambda x: str(x),inference))
  rs=jsonify({'inference':inference})
  resp = rs
 else:
  resp = Response("Error")
 resp.headers['Access-Control-Allow-Origin']='*'
 return resp

def key_present(iDic,iKey):
 if iKey in iDic.keys():
  return True
 else:
  return False

def receive_image(iReq):
 #Result dic
 rd = {'img':[0],'msg':'Error'}
 rf=iReq
 for key in rf.keys():
  data=key
 data_dic=json.loads(data)
 keys=['image']
 ke = [key_present(data_dic,k) for k in keys]
 if False in ke:
  return rd
 else:
  histogram = data_dic['image']
  np_img = np.asarray(histogram)
  np_img = np_img.reshape(1,np_img.shape[0])
  #Load keras model
  modelx = load_model(keras_model_name)
  inference = modelx.predict(np_img)
  rd['inference']=inference
  rd['msg']='Clear'
  return rd



@app.route('/test', methods=['POST'])
def test_show():
 print("Example of data received")
 rf=request.form
 print(rf)
 resp = Response("200")
 resp.headers['Access-Control-Allow-Origin']='*'
 return resp