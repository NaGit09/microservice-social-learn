from flask import Blueprint, jsonify
from ..recommender.tfidf_model import TfidfRecommender

recommend_bp = Blueprint("recommend", __name__)
model = TfidfRecommender()

@recommend_bp.route("/recommend/<user_id>", methods=["GET"])
def recommend_users(user_id):
    recommendations = model.recommend_users(user_id)
    if not recommendations:
        return jsonify([]), 200
    return jsonify(recommendations)
