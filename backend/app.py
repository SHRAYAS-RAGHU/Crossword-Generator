from flask import Flask, jsonify, request
from flask_cors import CORS
from pydantic import ValidationError

from crossword_logic.generator import get_crossword_for_client
from crossword_logic.validator import validate_answer
from crossword_logic.models import ValidationRequest

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes, adjust for production

@app.route('/api/crossword', methods=['GET'])
def get_puzzle_route():
    try:
        puzzle_client_data = get_crossword_for_client()
        return jsonify(puzzle_client_data.model_dump())
    except Exception as e:
        app.logger.error(f"Error generating crossword for client: {e}")
        return jsonify({"error": "Could not load crossword puzzle"}), 500

@app.route('/api/validate', methods=['POST'])
def validate_answer_route():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        validation_request = ValidationRequest(**data)
        response = validate_answer(validation_request)
        return jsonify(response.model_dump())
    except ValidationError as e:
        return jsonify({"error": "Invalid request data", "details": e.errors()}), 400
    except Exception as e:
        app.logger.error(f"Error validating answer: {e}")
        return jsonify({"error": "Could not validate answer"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001) # Changed port to 5001 to avoid common conflicts