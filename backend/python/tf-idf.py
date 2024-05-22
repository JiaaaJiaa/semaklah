# Read the document
# # When a specific text is highlighted, it will run through this script

import sys
import json
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load the documents from stdin
input = json.load(sys.stdin)

documents = input['documents']
specific_sentence = input['specific_sentence']
feedback = input['feedback']

# Create TF-IDF vectorizer
vectorizer = TfidfVectorizer(stop_words='english')

# Compute TF-IDF matrix for the documents and the specific sentence
tfidf_matrix_documents = vectorizer.fit_transform(documents)
tfidf_matrix_specific_sentence = vectorizer.transform([specific_sentence])

# Calculate cosine similarities
cosine_similarities = cosine_similarity(tfidf_matrix_specific_sentence, tfidf_matrix_documents)

# Get the indices of the documents sorted by similarity in descending order
sorted_indices = np.argsort(cosine_similarities[0])[::-1]

# Get the feedbacks sorted by similarity
sorted_feedbacks = [feedback[i] for i in sorted_indices[:3]]

# Write the output to stdout
output = {
    'sorted_feedback': sorted_feedbacks
}

json.dump(output, sys.stdout)
# output = {
#     'documents': documents,
#     'feedback': feedback,
#     'specific_sentence': specific_sentence
# }
# json.dump(output, sys.stdout)