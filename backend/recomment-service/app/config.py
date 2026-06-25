import os
from urllib.parse import urlparse

class Config:
    mongodb_uri = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI") or "mongodb://mongodb:27017/auth_service"
    parsed_uri = urlparse(mongodb_uri)
    db_name = parsed_uri.path.strip('/') or "auth_service"

    MONGO_DB = os.getenv("MONGO_DB", db_name)
    MONGO_URI = os.getenv("MONGO_URI", mongodb_uri)
