from flask import Flask
from .config import Config
from .extensions import mongo
from .routes.recommend import recommend_bp
from .routes.semantic_recommend import semantic_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Kết nối MongoDB
    mongo.connect(db=app.config["MONGO_DB"], host=app.config["MONGO_URI"])

    # Đăng ký blueprint
    app.register_blueprint(recommend_bp)
    app.register_blueprint(semantic_bp)

    # create test api
    @app.route("/", methods=["GET"])
    def home():
        return "Hello world"

    return app
