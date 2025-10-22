from bson import ObjectId
from flask import Blueprint 
from ..recommender.tfidf_model import TfidfRecommender
from ..utils.response import response_format
from ..models.user import User

recommend_bp = Blueprint("recommend", __name__)
recommender = TfidfRecommender()


@recommend_bp.route("/recommend/<user_id>", methods=["GET"])
def recommend_users(user_id):
    try:
        scores = recommender.recommend_users(user_id, top_k=5)
        if not scores:
            return response_format(404, "No recommendations found")

        # Kiểm tra collection có user nào không
        sample_user = User.objects.first()
        if not sample_user:
            return response_format(404, "No users found in database")

        is_objectid = not isinstance(sample_user.id, str)

        # Truy vấn user phù hợp với kiểu id
        if is_objectid:
            valid_ids = [
                ObjectId(uid) for uid in scores.keys() if ObjectId.is_valid(uid)
            ]
            users = User.objects(id__in=valid_ids)
        else:
            users = User.objects(id__in=list(scores.keys()))

        if not users:
            return response_format(404, "No matching users found")

        result = []
        for user in users:
            result.append(
                {
                    "id": str(user.id),
                    "username": user.username,
                    "fullname": user.fullname,
                    "bio": user.bio,
                    "avatar": user.avatar.to_mongo() if user.avatar else None,
                    "compatibility": round(scores.get(str(user.id), 0), 4),
                }
            )

        result.sort(key=lambda x: x["compatibility"], reverse=True)
        return response_format(200, "Recommendation success", result)

    except Exception as e:
        return response_format(500, f"Error: {str(e)}")
