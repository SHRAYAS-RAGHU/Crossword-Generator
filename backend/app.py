from flask import Flask, request, jsonify
from flask_cors import CORS
from crossword import generate_crossword, validate_answers

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['GET'])
def generate():
    crossword = generate_crossword()
    return jsonify(crossword)

@app.route('/validate', methods=['POST'])
def validate():
    data = request.json['answers']
    return jsonify(validate_answers(data))

if __name__ == '__main__':
    app.run(debug=True)
