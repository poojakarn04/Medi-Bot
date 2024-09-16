import pandas as pd
import numpy as np 
import os
from scipy.stats import mode 
#import matplotlib.pyplot as plt 
import seaborn as sns 
from sklearn.preprocessing import LabelEncoder 
from sklearn.model_selection import train_test_split, cross_val_score 
from sklearn.svm import SVC 
from sklearn.naive_bayes import GaussianNB 
from sklearn.ensemble import RandomForestClassifier 
from sklearn.metrics import accuracy_score, confusion_matrix 
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#@app.route('/')
#def home():
 #   return "Flask is running!"  # Just a simple message for now


@app.route('/receive-data', methods=['POST'])
def handle_data():
    data = request.json
    print(data)
    print(type(data))
    for k,v in data.items():
        print(v)
    print(v)
    print(type(v))
    new_data=[v]
    df=pd.read_csv(r"C:\Users\pooja\OneDrive\Desktop\Dayanand-hackman\views\Hackman_final_dataSet.csv")

    mcols=(df.columns[:-1])
    for col in mcols:
    #mod = df[col].mode
         df.fillna(value=0, inplace=True)

    encoder = LabelEncoder() 
    df["prediction"] = encoder.fit_transform(df["prediction"]) 
    X = df.iloc[:,:-1] #all rows n cols excl the last col(target var)
    y = df.iloc[:, -1] #target var col

    X_train, X_test, y_train, y_test =train_test_split( 
    X, y, test_size = 0.2, random_state = 24) 

    svm_model = SVC() 
    svm_model.fit(X_train, y_train) 
    preds = svm_model.predict(X_test) 
    nb_model = GaussianNB() 
    nb_model.fit(X_train, y_train) 
    preds = nb_model.predict(X_test)

    feature_names = X.columns.tolist()
# Create a DataFrame with the correct feature names
    new_data_df = pd.DataFrame(new_data, columns=feature_names)

    # Model predictions
    svm_pred = svm_model.predict(new_data_df)
    #rf_pred = rf_model.predict(new_data_df)
    nb_pred = nb_model.predict(new_data_df)

    l=[]
    for i in [svm_pred,nb_pred]:
        disease_name = encoder.inverse_transform(i)# Convert the numerical prediction to the disease name
        #print(disease_name)
        l.append(disease_name[0])

    final_pred = pd.DataFrame(l).mode().iloc[0, 0]
    print(final_pred)



    response = {'message': final_pred}
    return jsonify(response), 200



if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))  # Use Render's provided port or default to 8000
    app.run(debug=False, host='0.0.0.0', port=port)

