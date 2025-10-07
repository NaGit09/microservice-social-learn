from sentence_transformers import SentenceTransformer, util
import torch
import re, unicodedata
from ..models.profile import Profile

class SemanticRecommender:
    # 
    def __init__(self, model_name="paraphrase-MiniLM-L6-v2"):
        print(f"🔹 Loading SentenceTransformer model: {model_name}")
        self.model = SentenceTransformer(model_name)
        self.embeddings = None
        self.profile_ids = None

    def _clean_text(self, text):
        if not text:
            return ""
        text = unicodedata.normalize("NFC", text.lower())
        text = re.sub(r"[^a-zA-Z\s]", " ", text)
        return re.sub(r"\s+", " ", text).strip()

    def _build_text(self, profile):
        parts = [
            self._clean_text(profile.school),
            self._clean_text(profile.major),
            self._clean_text(profile.class_name),
            self._clean_text(profile.hometown),
            self._clean_text(" ".join(profile.references or [])),
        ]
        return " ".join(filter(None, parts))

    def load_profiles(self, force_reload=False):
        """Load và encode tất cả hồ sơ nếu embeddings chưa có hoặc cần reload."""
        if self.embeddings is not None and not force_reload:
            return

        profiles = list(Profile.objects())
        if not profiles:
            print("⚠️ No profiles found in database.")
            self.embeddings, self.profile_ids = None, None
            return

        self.profile_ids = [str(p._id) for p in profiles]
        contents = [self._build_text(p) for p in profiles]

        print(f"🔹 Encoding {len(contents)} profiles...")
        self.embeddings = self.model.encode(
            contents,
            convert_to_tensor=True,
            show_progress_bar=False
        )
        # 
    def recommend(self, user_id, top_k=5):
        if self.embeddings is None or self.profile_ids is None:
            self.load_profiles()

        if user_id not in self.profile_ids:
            return []

        user_idx = self.profile_ids.index(user_id)
        user_vec = self.embeddings[user_idx].unsqueeze(0)

        cosine_scores = util.cos_sim(user_vec, self.embeddings)[0]
        top_results = torch.topk(cosine_scores, k=top_k + 1)

        recommendations = []
        for score, idx in zip(top_results.values, top_results.indices):
            idx = idx.item()
            if idx != user_idx:
                recommendations.append(self.profile_ids[idx])

        return recommendations[:top_k]
