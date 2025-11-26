import os


class Config:
    MONGO_DB = os.getenv("MONGO_DB", "main-db")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/main-db")
