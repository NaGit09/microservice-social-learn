# recommender.py
from typing import Dict, List, Optional, Tuple
import os
import pickle
import unicodedata
import re
from dataclasses import dataclass

import numpy as np
import pandas as pd
from joblib import dump, load
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel 
from scipy.sparse import csr_matrix

from ..models.profile import Profile


@dataclass
class RecommenderConfig:
    max_features: int = 5000
    ngram_range: Tuple[int, int] = (1, 2)
    stop_words: Optional[str] = "english"
    cache_dir: str = "/tmp/tfidf_recommender_cache"
    cache_basename: str = "tfidf_recommender"


class TfidfRecommender:
 
    def __init__(self, config: Optional[RecommenderConfig] = None):
        self.config = config or RecommenderConfig()
        self.vectorizer = TfidfVectorizer(
            analyzer="word",
            token_pattern=r"(?u)\b\w+\b", 
            stop_words=self.config.stop_words,
            ngram_range=self.config.ngram_range,
            max_features=self.config.max_features,
        )
        self.tfidf_matrix: Optional[csr_matrix] = None
        self.profile_ids: List[str] = []
        os.makedirs(self.config.cache_dir, exist_ok=True)

    def _clean_text(self, text: Optional[str]) -> str:
        if not text:
            return ""
        # prepare
        text = unicodedata.normalize("NFC", text).lower()
        # keep letters and spaces only
        cleaned_chars = []
        for ch in text:
            cat = unicodedata.category(ch)
            if ch.isspace():
                cleaned_chars.append(" ")
            elif cat.startswith("L"):  # Letter (includes Vietnamese letters)
                cleaned_chars.append(ch)
            else:
                # convert punctuation/marks/numbers -> space
                cleaned_chars.append(" ")
        cleaned = "".join(cleaned_chars)
        # collapse multiple spaces and strip
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        return cleaned

    def _build_profile_content(self, profile: Profile) -> str:
        # Lấy từng field (tên field có thể khác project bạn — chỉnh lại nếu cần)
        school = self._clean_text(getattr(profile, "school", "") or "")
        major = self._clean_text(getattr(profile, "major", "") or "")
        class_name = self._clean_text(getattr(profile, "class_name", "") or "")
        hometown = self._clean_text(getattr(profile, "hometown", "") or "")
        # references có thể là list[str]
        refs = getattr(profile, "references", None) or []
        if isinstance(refs, (list, tuple)):
            references = " ".join([self._clean_text(r) for r in refs if r])
        else:
            references = self._clean_text(str(refs))

        # trọng số đơn giản: major quan trọng hơn
        parts = []
        if school:
            parts.append((school, 1))
        if major:
            parts.append((major, 3))
        if class_name:
            parts.append((class_name, 1))
        if hometown:
            parts.append((hometown, 1))
        if references:
            parts.append((references, 2))

        # nếu không có nội dung meaningful -> trả về empty string
        if not parts:
            return ""

        weighted = []
        for text, weight in parts:
            # lặp chuỗi để làm tăng TF tương đối
            # giới hạn lần lặp để tránh explosion (vd: weight 3 ok)
            repeat = max(1, int(weight))
            weighted.append((" " + text + " ") * repeat)

        return " ".join(weighted).strip()

    def load_data(self, force_rebuild: bool = False) -> None:
        if not force_rebuild:
            try:
                self._load_cache()
                if self.tfidf_matrix is not None and self.profile_ids:
                    return
            except Exception:
                # fallback to rebuild
                pass

        # load from DB
        profiles = list(Profile.objects())
        if not profiles:
            self.tfidf_matrix = None
            self.profile_ids = []
            return

        data = []
        ids = []
        for p in profiles:
            pid = str(p.id)
            content = self._build_profile_content(p)
            # skip profiles with no meaningful content to avoid polluting matrix
            if not content:
                continue
            ids.append(pid)
            data.append(content)

        if not data:
            self.tfidf_matrix = None
            self.profile_ids = []
            return

        df = pd.DataFrame({"id": ids, "content": data})
        # fit vectorizer and transform
        self.tfidf_matrix = self.vectorizer.fit_transform(df["content"])
        self.profile_ids = df["id"].tolist()
        # save cache for reuse
        try:
            self._save_cache()
        except Exception:
            pass

    def recommend_users(self, user_id: str, top_k: int = 5) -> Dict[str, float]:
        if self.tfidf_matrix is None or not self.profile_ids:
            self.load_data()

        if not self.profile_ids:
            return {}

        if user_id not in self.profile_ids:
            return {}

        idx = self.profile_ids.index(user_id)
        # nếu ma trận là None hoặc idx out of range => return empty
        if self.tfidf_matrix is None or idx < 0 or idx >= self.tfidf_matrix.shape[0]:
            return {}

        # dùng linear_kernel cho single-row similarity (tối ưu)
        cosine_sim = linear_kernel(self.tfidf_matrix[idx], self.tfidf_matrix).flatten()
        # loại bỏ chính nó
        cosine_sim[idx] = -1.0
        # lấy top_k indices
        if top_k <= 0:
            return {}

        top_indices = np.argpartition(-cosine_sim, range(min(top_k, cosine_sim.size)))[
            :top_k
        ]
        # sắp xếp top_indices theo score giảm dần
        top_indices = top_indices[np.argsort(-cosine_sim[top_indices])]
        result = {
            self.profile_ids[i]: float(cosine_sim[i])
            for i in top_indices
            if cosine_sim[i] > 0
        }
        return result

    def add_or_update_profile(self, profile: Profile) -> None:
        self.load_data(force_rebuild=True)

    def remove_profile(self, profile_id: str) -> None:
        self.load_data(force_rebuild=True)

    def _cache_paths(self) -> Tuple[str, str, str]:
        base = os.path.join(self.config.cache_dir, self.config.cache_basename)
        vec_path = f"{base}_vectorizer.joblib"
        ids_path = f"{base}_profile_ids.pkl"
        mat_path = f"{base}_matrix.joblib"
        return vec_path, ids_path, mat_path

    def _save_cache(self) -> None:
        vec_path, ids_path, mat_path = self._cache_paths()
        dump(self.vectorizer, vec_path)
        with open(ids_path, "wb") as f:
            pickle.dump(self.profile_ids, f)
        # tfidf_matrix may be sparse csr_matrix => joblib.dump works
        dump(self.tfidf_matrix, mat_path)

    def _load_cache(self) -> None:
        vec_path, ids_path, mat_path = self._cache_paths()
        if not (
            os.path.exists(vec_path)
            and os.path.exists(ids_path)
            and os.path.exists(mat_path)
        ):
            raise FileNotFoundError("Cache not found")
        self.vectorizer = load(vec_path)
        with open(ids_path, "rb") as f:
            self.profile_ids = pickle.load(f)
        self.tfidf_matrix = load(mat_path)


if __name__ == "__main__":
    rec = TfidfRecommender()
    rec.load_data()  
    user_id_example = "123"
    result = rec.recommend_users(user_id_example, top_k=5)
    print("Top similar users:", result)
