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

    def recommend_users(self, user_id, top_k=5):
        profiles = list(Profile.objects())
        if not profiles:
            return {}

        data = pd.DataFrame(
            [{"id": str(p.id), "content": self._build_profile_content(p)} for p in profiles]
        )

        tfidf_matrix = self.vectorizer.fit_transform(data["content"])

        if user_id not in data["id"].values:
            return {}

        idx = data[data["id"] == user_id].index[0]
        cosine_sim = cosine_similarity(tfidf_matrix[idx], tfidf_matrix).flatten()

        similar_indices = cosine_sim.argsort()[::-1][1: top_k + 1]

        result = {}
        for i in similar_indices:
            result[data.iloc[i]["id"]] = float(cosine_sim[i])

        return result

