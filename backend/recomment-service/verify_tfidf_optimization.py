import time
import sys
import os
from unittest.mock import MagicMock, patch
import pandas as pd

# Add the project root to the python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Mock the Profile model before importing the recommender
mock_profile_class = MagicMock()
sys.modules["app.models.profile"] = MagicMock()
sys.modules["app.models.profile"].Profile = mock_profile_class

# Now import the recommender
from app.recommender.tfidf_model import TfidfRecommender


def create_mock_profile(id, school, major, class_name, hometown, references):
    mock = MagicMock()
    mock.id = id
    mock.school = school
    mock.major = major
    mock.class_name = class_name
    mock.hometown = hometown
    mock.references = references
    return mock


def verify_optimization():
    # Setup mock data
    mock_profiles = [
        create_mock_profile("user1", "School A", "CS", "Class 1", "City X", ["ref1"]),
        create_mock_profile(
            "user2", "School A", "CS", "Class 1", "City X", ["ref1"]
        ),  # Similar to user1
        create_mock_profile("user3", "School B", "Math", "Class 2", "City Y", ["ref2"]),
    ]
    mock_profile_class.objects.return_value = mock_profiles

    recommender = TfidfRecommender()

    print("--- Starting Verification ---")

    # First call - should trigger load_data
    start_time = time.time()
    recommendations1 = recommender.recommend_users("user1", top_k=2)
    end_time = time.time()
    duration1 = end_time - start_time
    print(f"First call duration (loading + inference): {duration1:.4f}s")

    # Verify correctness
    assert "user2" in recommendations1, "User 1 should be recommended User 2"
    print("✅ Correctness check passed for first call.")

    # Second call - should use cache
    start_time = time.time()
    recommendations2 = recommender.recommend_users("user1", top_k=2)
    end_time = time.time()
    duration2 = end_time - start_time
    print(f"Second call duration (cached inference): {duration2:.4f}s")

    # Verify correctness again
    assert recommendations1 == recommendations2, "Recommendations should be consistent"
    print("✅ Consistency check passed.")

    # Verify performance improvement
    if duration2 < duration1:
        print(
            f"✅ Performance improvement verified: {duration1 / duration2:.2f}x faster"
        )
    else:
        print(
            "⚠️ No performance improvement observed (dataset might be too small to notice)"
        )


if __name__ == "__main__":
    verify_optimization()
