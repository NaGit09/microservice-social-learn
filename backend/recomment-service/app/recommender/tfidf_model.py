from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import re
import unicodedata
from ..models.profile import Profile


class TfidfRecommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            stop_words="english", ngram_range=(1, 2), max_features=5000
        )
        self.tfidf_matrix = None
        self.profile_ids = None

    def _clean_text(self, text):
        if not text:
            return ""
        text = unicodedata.normalize("NFC", text.lower())
        text = re.sub(r"[^a-zA-Z\s]", " ", text)
        return re.sub(r"\s+", " ", text).strip()

    def _build_profile_content(self, profile):
        school = self._clean_text(profile.school)
        major = self._clean_text(profile.major)
        class_name = self._clean_text(profile.class_name)
        hometown = self._clean_text(profile.hometown)
        references = self._clean_text(" ".join(profile.references or []))

        weighted_content = (
            (school + " ") * 1
            + (major + " ") * 3
            + (class_name + " ") * 1
            + (hometown + " ") * 1
            + (references + " ") * 2
        )
        return weighted_content.strip()

    def load_data(self):
        profiles = list(Profile.objects())
        if not profiles:
            self.tfidf_matrix = None
            self.profile_ids = []
            return

        data = [
            {"id": str(p.id), "content": self._build_profile_content(p)}
            for p in profiles
        ]

        df = pd.DataFrame(data)
        self.tfidf_matrix = self.vectorizer.fit_transform(df["content"])
        self.profile_ids = df["id"].tolist()

    def recommend_users(self, user_id, top_k=5):
        if self.tfidf_matrix is None:
            self.load_data()

        if not self.profile_ids or user_id not in self.profile_ids:
            return {}

        idx = self.profile_ids.index(user_id)
        cosine_sim = cosine_similarity(
            self.tfidf_matrix[idx], self.tfidf_matrix
        ).flatten()

        # Get indices of top_k similar users (excluding the user themselves)
        similar_indices = cosine_sim.argsort()[::-1][1 : top_k + 1]

        result = {}
        for i in similar_indices:
            result[self.profile_ids[i]] = float(cosine_sim[i])

        return result
