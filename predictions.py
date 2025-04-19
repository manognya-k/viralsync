# import tensorflow as tf
# from tensorflow.keras.models import load_model
# import pickle
# import numpy as np

# # Load model and tokenizer
# def load_model_and_tokenizer(model_path, tokenizer_path, label_encoder_path):
#     model = load_model(model_path)
#     with open(tokenizer_path, 'rb') as f:
#         tokenizer = pickle.load(f)
#     with open(label_encoder_path, 'rb') as f:
#         label_encoder = pickle.load(f)
#     return model, tokenizer, label_encoder

# def predict_sentiment(model, tokenizer, label_encoder, comments):
#     # Tokenize and predict sentiment
#     sequences = tokenizer.texts_to_sequences(comments)
#     padded_sequences = tf.keras.preprocessing.sequence.pad_sequences(sequences, maxlen=100)
    
#     # Make predictions
#     predictions = model.predict(padded_sequences)
#     sentiment_labels = label_encoder.inverse_transform(np.argmax(predictions, axis=1))
    
#     return sentiment_labels

# import os
# os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
import tensorflow as tf
import numpy as np
import pickle

# tf.config.set_visible_devices([], 'GPU')

# Load tokenizer and label encoder
with open("assets/tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

with open("assets/label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)

# Load model
model = tf.keras.models.load_model("models/cnn_lstm_sentiment_model.h5")

# Predict sentiment
def predict_sentiment(text):
    seq = tokenizer.texts_to_sequences([text])
    padded = tf.keras.preprocessing.sequence.pad_sequences(seq, maxlen=50)
    pred = model.predict(padded)
    sentiment_label = label_encoder.inverse_transform([np.argmax(pred)])
    return sentiment_label[0]
