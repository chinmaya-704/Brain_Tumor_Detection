

https://github.com/user-attachments/assets/3be99679-338a-4bcd-bc6d-ca93ac362b07

OBJECTIVE

The main objective of this project is:
1. Implementation of deep learning model to classify brain tumor in different category from MRI scan images.
2. This model is expected to give a greater accuracy with a better model of classification.

METHODOLOGY

Data Collection:
1. The dataset consists of MRI scan images collected from kaggle. The images are categorised into various types of brain tumour.
- Glioma
- Meningioma
- No Tumor
- Pituitary tumor
2. Data Preprocessing
- Resizing the images to have shards of the same size (299×299 pixels)
- Normalize pixel values to be in the range [0,1].
- Performing data augmentation to generalize the model
3. Model Architecture
- The model is using a convolutional neural network (CNN). The following steps are followed:
- Used a pre-trained deep learning model (e.g., InceptionV3) for feature extraction.
- Included a few fully connected layers for classification.
- Used softmax activation for multi class classification
- Compilation of model done by using categorical cross-entropy loss and Adam optimizer.
4. Training and Validation
- The model received its training through an 80-10-10 divide of data between training
- The implementation of early stopping together with model checkpointing enabled optimal performance optimization.
5. Evaluation Metrics
- Accuracy
- Precision, Recall, and F1-score
- The classification performance can be evaluated through the utilization of confusion matrices for visualization purposes.

RESULTS
- The evaluation on the test data revealed an accuracy result of 99.8%.
- The combination of high recall together with precision shows the model produces few mistakes in positive and negative results.
- The model demonstrated effective discrimination between different tumor types due to its high level of confidence according to the confusion matrix results.
- The model received successful test results when examined on genuine MRI datasets.
