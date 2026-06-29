from sentence_transformers import SentenceTransformer, util
import torch
import re
import unicodedata
from ..models.profile import Profile


class SemanticRecommender:
    #
    def __init__(self, model_name="paraphrase-MiniLM-L6-v2"):
        print(f"🔹 Loading SentenceTransformer model: {model_name}")
        self.model = SentenceTransformer(model_name)
        self.embeddings = None
        self.profile_ids = None
        self.profiles_cache = {}

    def _clean_text(self, text):
        if not text:
            return ""
        text = unicodedata.normalize("NFC", text).lower()
        cleaned_chars = []
        for ch in text:
            cat = unicodedata.category(ch)
            if ch.isspace():
                cleaned_chars.append(" ")
            elif cat.startswith("L") or cat.startswith("N"):
                cleaned_chars.append(ch)
            else:
                cleaned_chars.append(" ")
        cleaned = "".join(cleaned_chars)
        return re.sub(r"\s+", " ", cleaned).strip()

    def _build_text(self, profile):
        year_val = getattr(profile, "year", None)
        year_str = f"năm {year_val}" if year_val else ""
        parts = [
            self._clean_text(getattr(profile, "school", "")),
            self._clean_text(getattr(profile, "major", "")),
            self._clean_text(getattr(profile, "class_name", "")),
            self._clean_text(getattr(profile, "hometown", "")),
            self._clean_text(" ".join(getattr(profile, "references", []) or [])),
            self._clean_text(" ".join(getattr(profile, "hobby", []) or [])),
            self._clean_text(year_str),
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
            self.profiles_cache = {}
            return

        self.profile_ids = [str(p.id) for p in profiles]
        self.profiles_cache = {str(p.id): p for p in profiles}
        contents = [self._build_text(p) for p in profiles]

        print(f"🔹 Encoding {len(contents)} profiles...")
        self.embeddings = self.model.encode(
            contents, convert_to_tensor=True, show_progress_bar=False
        )
        #

    def update_profile_embedding(self, user_id):
        """Update or add a profile embedding in memory dynamically."""
        # Lazily load profiles if not already loaded
        if self.embeddings is None or self.profile_ids is None:
            self.load_profiles()
            return

        from mongoengine.errors import ValidationError
        from bson import ObjectId

        profile = None
        try:
            profile = Profile.objects(id=user_id).first()
        except (ValidationError, TypeError):
            if ObjectId.is_valid(user_id):
                try:
                    profile = Profile.objects(id=ObjectId(user_id)).first()
                except Exception:
                    profile = None

        if not profile:
            # If the profile was deleted, remove it from memory
            if user_id in self.profile_ids:
                idx = self.profile_ids.index(user_id)
                self.profile_ids.pop(idx)
                if user_id in self.profiles_cache:
                    del self.profiles_cache[user_id]
                self.embeddings = torch.cat([self.embeddings[:idx], self.embeddings[idx+1:]])
                print(f"🔹 Removed profile {user_id} from semantic recommender memory.")
            return

        # Build text and encode it
        text = self._build_text(profile)
        new_embedding = self.model.encode([text], convert_to_tensor=True, show_progress_bar=False)

        if user_id in self.profile_ids:
            # Update existing profile
            idx = self.profile_ids.index(user_id)
            self.embeddings[idx] = new_embedding[0]
            self.profiles_cache[user_id] = profile
            print(f"🔹 Updated profile {user_id} in semantic recommender memory.")
        else:
            # Append new profile
            self.profile_ids.append(user_id)
            self.profiles_cache[user_id] = profile
            self.embeddings = torch.cat([self.embeddings, new_embedding])
            print(f"🔹 Added new profile {user_id} to semantic recommender memory.")

    def recommend(self, user_id, top_k=5):
        if self.embeddings is None or self.profile_ids is None:
            self.load_profiles()

        if user_id not in self.profile_ids:
            return {}

        user_idx = self.profile_ids.index(user_id)
        user_vec = self.embeddings[user_idx].unsqueeze(0)

        cosine_scores = util.cos_sim(user_vec, self.embeddings)[0]
        
        target_profile = self.profiles_cache.get(user_id)
        hybrid_scores = {}
        for idx, candidate_id in enumerate(self.profile_ids):
            if idx == user_idx:
                continue

            base_score = float(cosine_scores[idx].item())
            if base_score <= 0:
                continue

            candidate_profile = self.profiles_cache.get(candidate_id)
            boost = 0.0
            if target_profile and candidate_profile:
                # 1. Class Name Match (high affinity for classmates)
                if getattr(target_profile, "class_name", None) and getattr(candidate_profile, "class_name", None):
                    if target_profile.class_name.strip().lower() == candidate_profile.class_name.strip().lower():
                        boost += 0.15

                # 2. Hobby Overlap Jaccard Similarity
                h1 = getattr(target_profile, "hobby", []) or []
                h2 = getattr(candidate_profile, "hobby", []) or []
                if h1 and h2:
                    set1 = set([str(x).strip().lower() for x in h1 if x])
                    set2 = set([str(x).strip().lower() for x in h2 if x])
                    intersection = set1.intersection(set2)
                    union = set1.union(set2)
                    if union:
                        jaccard = len(intersection) / len(union)
                        boost += jaccard * 0.20

                # 3. Hometown Match
                if getattr(target_profile, "hometown", None) and getattr(candidate_profile, "hometown", None):
                    ht1 = target_profile.hometown.strip().lower()
                    ht2 = candidate_profile.hometown.strip().lower()
                    if ht1 and ht1 == ht2:
                        boost += 0.05

                # 4. Same Year Match
                if getattr(target_profile, "year", None) is not None and getattr(candidate_profile, "year", None) is not None:
                    if target_profile.year == candidate_profile.year:
                        boost += 0.05

            hybrid_scores[candidate_id] = min(1.0, base_score + boost)

        # Sắp xếp lại và lấy ra top k
        sorted_recommendations = sorted(hybrid_scores.items(), key=lambda x: x[1], reverse=True)[:top_k]
        result = {uid: score for uid, score in sorted_recommendations}
        return result
