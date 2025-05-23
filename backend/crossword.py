def generate_crossword():
    return {
        "grid_size": 10,
        "words": [
            {"id": 1, "clue": "Unit of company ownership", "answer": "stock", "row": 0, "col": 0, "direction": "across"},
            {"id": 2, "clue": "Bonds pay this", "answer": "interest", "row": 2, "col": 0, "direction": "across"},
        ]
    }

def validate_answers(answers):
    result = {}
    for entry in answers:
        result[entry["id"]] = entry["userAnswer"].lower() == entry["correctAnswer"].lower()
    return {"correct": result}
