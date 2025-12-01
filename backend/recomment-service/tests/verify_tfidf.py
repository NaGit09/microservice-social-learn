import sys
import os
import unittest
from unittest.mock import MagicMock, patch
import pandas as pd
import numpy as np

# Add the project root to the python path
# Assuming we run this from backend/recomment-service/
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))

from app.recommender.tfidf_model import TfidfRecommender


class TestTfidfRecommender(unittest.TestCase):
    def setUp(self):
        self.recommender = TfidfRecommender()

    def test_clean_text_vietnamese(self):
        text = "Đại học Nông Lâm TP.HCM"
        cleaned = self.recommender._clean_text(text)
        # Expecting lowercase and no special chars except spaces/alphanumeric
        # Note: \w in regex might not match all Vietnamese chars depending on locale/python version,
        # but the implementation uses unicodedata.normalize("NFC", ...) and re.sub(r"[^\w\s]", " ", ...)
        # Let's see what the actual output is.
        print(f"Original: {text}, Cleaned: {cleaned}")
        self.assertTrue("đại học nông lâm" in cleaned)

    def test_build_profile_content(self):
        profile = MagicMock()
        profile.school = "Nông Lâm"
        profile.major = "CNTT"
        profile.class_name = "DH18DT"
        profile.hometown = "TP.HCM"
        profile.references = ["Python", "Java"]
        profile.hobby = ["Đá bóng", "Game"]
        profile.year = 4

        content = self.recommender._build_profile_content(profile)
        print(f"Profile Content: {content}")
        self.assertIn("nông lâm", content)
        self.assertIn("đá bóng", content)
        self.assertIn("4", content)

    @patch("app.recommender.tfidf_model.Profile")
    def test_recommend_users(self, mock_profile):
        # Mock data
        p1 = MagicMock(
            id="1",
            school="A",
            major="IT",
            class_name="C1",
            hometown="H1",
            references=[],
            hobby=[],
            year=1,
        )
        p2 = MagicMock(
            id="2",
            school="A",
            major="IT",
            class_name="C1",
            hometown="H1",
            references=[],
            hobby=[],
            year=1,
        )  # Similar to p1
        p3 = MagicMock(
            id="3",
            school="B",
            major="Art",
            class_name="C2",
            hometown="H2",
            references=[],
            hobby=[],
            year=2,
        )  # Different

        mock_profile.objects.only.return_value = [p1, p2, p3]

        self.recommender.load_data()
        recommendations = self.recommender.recommend_users("1", top_k=2)

        print(f"Recommendations for user 1: {recommendations}")
        self.assertIn("2", recommendations)
        self.assertNotIn("1", recommendations)
        self.assertGreater(recommendations["2"], 0.0)


if __name__ == "__main__":
    unittest.main()
