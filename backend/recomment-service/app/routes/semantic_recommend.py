from flask import Blueprint, jsonify
from ..recommender.semantic_model import SemanticRecommender

semantic_bp = Blueprint("semantic_recommend", __name__)
model = SemanticRecommender()

@semantic_bp.route("/semantic/recommend/<user_id>", methods=["GET"])
def semantic_recommend(user_id):
    result = model.recommend(user_id)
    if "error" in result:
        return jsonify(result), 404
    return jsonify(result)
