import pandas as pd

import numpy as np

import tensorflow as tf

from tensorflow.keras.layers import Embedding, LSTM, Dense, GlobalAveragePooling1D

from tensorflow.keras.preprocessing.text import Tokenizer

from tensorflow.keras.preprocessing.sequence import pad_sequences

import matplotlib.pyplot as plt



print(f"TensorFlow Version: {tf.__version__}")
# Sample data for demonstration

urls = [

    "google.com", 

    "paypal-secure-login.tk", 

    "microsoft-update-alert.com", 

    "github.com",

    "amazon-prime-verify.net"

]

labels = [0, 1, 1, 0, 1] # 0 = Legitimate, 1 = Phishing



# Tokenization

vocab_size = 1000

max_length = 50

tokenizer = Tokenizer(num_words=vocab_size, char_level=True, oov_token="<OOV>")

tokenizer.fit_on_texts(urls)



sequences = tokenizer.texts_to_sequences(urls)

padded = pad_sequences(sequences, maxlen=max_length, padding='post')



print(f"Padded sequence shape: {padded.shape}")
embedding_dim = 16



model = tf.keras.Sequential([

    Embedding(vocab_size, embedding_dim, input_length=max_length),

    GlobalAveragePooling1D(),

    Dense(24, activation='relu'),

    Dense(1, activation='sigmoid')

])



model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

model.summary()