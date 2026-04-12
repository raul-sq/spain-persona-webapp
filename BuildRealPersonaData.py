"""
BuildRealPersonaData.py
Version: 1.0

Builds an aggregated JSON file for the Spain Persona Frontier web app from the
Hugging Face dataset `apol/spain-reference-personas-frontier`, subset
`persona_core`.

The script groups records by:
- region
- urban_rural
- age_group

And exports, for each aggregated segment:
- weighted size
- weighted trust / price sensitivity
- top issue
- aggregated media channels
- top gender
- top device access
- top internet intensity
- top education
- top socioeconomic tier
- top reading frequency
- readiness score

Output:
- realPersonaData.json
"""

from __future__ import annotations

import json
from collections import defaultdict
from typing import Callable

import pandas as pd
from datasets import load_dataset

DATASET_ID = "apol/spain-reference-personas-frontier"
CONFIG = "persona_core"
OUTPUT_JSON = "realPersonaData.json"

CHANNEL_KEYS = ["Social media", "TV", "Press", "Radio", "Messaging apps"]


def first_issue(value: str) -> str:
    if not value:
        return "—"
    return value.split("|")[0].strip() or "—"


def split_sources(value: str) -> list[str]:
    if not value:
        return []
    return [part.strip() for part in str(value).split("|") if part.strip()]


def bucket_source(source: str) -> str | None:
    s = str(source).strip().lower()

    if any(x in s for x in ["whatsapp", "telegram", "mensajería", "mensajeria"]):
        return "Messaging apps"

    if s == "x" or any(
        x in s for x in ["instagram", "tiktok", "facebook", "youtube", "twitch"]
    ):
        return "Social media"

    if any(x in s for x in ["televisión", "television", "tv"]):
        return "TV"

    if "radio" in s or "podcast" in s:
        return "Radio"

    if any(x in s for x in ["prensa", "periódico", "periodico", "diario", "digital"]):
        return "Press"

    return None


def normalize(value) -> str:
    if value is None:
        return ""
    return str(value).strip().lower().replace(" ", "_")


def weighted_top_value(
    series: pd.Series, weights: pd.Series, default: str = "—"
) -> str:
    totals: dict[str, float] = defaultdict(float)

    for value, weight in zip(series.fillna(default), weights.fillna(0.0)):
        key = str(value).strip() if str(value).strip() else default
        totals[key] += float(weight)

    if not totals:
        return default

    return max(totals.items(), key=lambda x: x[1])[0]


def weighted_average_score(
    series: pd.Series, weights: pd.Series, scorer: Callable[[str], float]
) -> float:
    total_weight = float(weights.fillna(0.0).sum())

    if total_weight == 0:
        return 0.0

    weighted_sum = 0.0

    for value, weight in zip(series, weights.fillna(0.0)):
        weighted_sum += scorer(value) * float(weight)

    return weighted_sum / total_weight


def score_device_access(value: str) -> float:
    v = normalize(value)

    mapping = {
        "desktop_laptop_and_phone": 100,
        "desktop_and_phone": 95,
        "laptop_and_phone": 95,
        "multi_device": 95,
        "computer_and_phone": 95,
        "computer_access": 85,
        "desktop_laptop_only": 80,
        "desktop_only": 75,
        "laptop_only": 75,
        "tablet_and_phone": 70,
        "tablet_only": 55,
        "phone_only": 35,
        "shared_access": 30,
        "limited_access": 20,
        "no_access": 0,
    }

    return mapping.get(v, 50)


def score_internet_intensity(value: str) -> float:
    v = normalize(value)

    mapping = {
        "heavy": 100,
        "high": 90,
        "daily": 85,
        "regular": 75,
        "medium": 65,
        "moderate": 60,
        "light": 40,
        "occasional": 35,
        "rare": 20,
        "very_low": 10,
        "none": 0,
    }

    return mapping.get(v, 50)


def score_education(value: str) -> float:
    v = normalize(value)

    mapping = {
        "postgraduate": 100,
        "master": 100,
        "doctorate": 100,
        "university": 88,
        "higher_education": 88,
        "vocational_higher": 78,
        "vocational": 72,
        "upper_secondary": 60,
        "secondary": 55,
        "lower_secondary": 45,
        "primary": 25,
        "none": 0,
    }

    return mapping.get(v, 50)


def score_socioeconomic_tier(value: str) -> float:
    v = normalize(value)

    mapping = {
        "affluent": 100,
        "upper_middle": 85,
        "middle": 65,
        "working": 45,
        "precarious": 20,
        "low": 15,
    }

    return mapping.get(v, 50)


def score_reading_frequency(value: str) -> float:
    v = normalize(value)

    mapping = {
        "very_often": 100,
        "often": 85,
        "frequently": 85,
        "sometimes": 55,
        "occasionally": 45,
        "rarely": 20,
        "never": 0,
    }

    return mapping.get(v, 50)


def main() -> None:
    print("Loading dataset...")
    ds = load_dataset(DATASET_ID, CONFIG)

    print("Selecting relevant columns...")
    columns = [
        "region",
        "urban_rural",
        "age_group",
        "gender",
        "institutional_trust",
        "price_sensitivity",
        "issue_salience_top3",
        "primary_news_sources",
        "population_weight",
        "device_access",
        "internet_intensity",
        "education",
        "socioeconomic_tier",
        "reading_frequency",
    ]

    df = ds["train"].select_columns(columns).to_pandas()

    print("Normalizing fields...")
    df["top_issue"] = df["issue_salience_top3"].fillna("").apply(first_issue)
    df["weight"] = df["population_weight"].fillna(0.0)

    group_cols = ["region", "urban_rural", "age_group"]

    print("Aggregating segments...")
    segments = []

    for (region, area_type, age_group), grp in df.groupby(group_cols, dropna=False):
        total_weight = float(grp["weight"].sum())

        if total_weight == 0:
            continue

        avg_trust = float(
            (grp["institutional_trust"].fillna(0.0) * grp["weight"]).sum()
            / total_weight
        )
        avg_price = float(
            (grp["price_sensitivity"].fillna(0.0) * grp["weight"]).sum()
            / total_weight
        )

        top_issue = weighted_top_value(grp["top_issue"], grp["weight"])
        gender_top = weighted_top_value(grp["gender"], grp["weight"])
        device_access_top = weighted_top_value(grp["device_access"], grp["weight"])
        internet_intensity_top = weighted_top_value(
            grp["internet_intensity"], grp["weight"]
        )
        education_top = weighted_top_value(grp["education"], grp["weight"])
        socioeconomic_tier_top = weighted_top_value(
            grp["socioeconomic_tier"], grp["weight"]
        )
        reading_frequency_top = weighted_top_value(
            grp["reading_frequency"], grp["weight"]
        )

        device_score = weighted_average_score(
            grp["device_access"], grp["weight"], score_device_access
        )
        internet_score = weighted_average_score(
            grp["internet_intensity"], grp["weight"], score_internet_intensity
        )
        education_score = weighted_average_score(
            grp["education"], grp["weight"], score_education
        )
        socioeconomic_score = weighted_average_score(
            grp["socioeconomic_tier"], grp["weight"], score_socioeconomic_tier
        )
        reading_score = weighted_average_score(
            grp["reading_frequency"], grp["weight"], score_reading_frequency
        )

        readiness_score = (
            device_score * 0.25
            + internet_score * 0.25
            + education_score * 0.20
            + socioeconomic_score * 0.15
            + reading_score * 0.15
        )

        channel_weights = {key: 0.0 for key in CHANNEL_KEYS}

        for _, row in grp.iterrows():
            weight = float(row["weight"])
            sources = split_sources(row["primary_news_sources"])
            seen_buckets = set()

            for source in sources:
                bucket = bucket_source(source)
                if bucket:
                    seen_buckets.add(bucket)

            for bucket in seen_buckets:
                channel_weights[bucket] += weight

        channel_scores = {
            key: round((channel_weights[key] / total_weight) * 100, 1)
            for key in CHANNEL_KEYS
        }

        label = f"{age_group} · {area_type} · {region}"

        segments.append(
            {
                "id": f"{region}-{area_type}-{age_group}".lower().replace(" ", "-"),
                "label": label,
                "region": region,
                "areaType": area_type,
                "ageGroup": age_group,
                "size": round(total_weight, 2),
                "trustInstitution": round(avg_trust * 100, 1),
                "priceSensitivity": round(avg_price * 100, 1),
                "topIssue": top_issue,
                "channels": channel_scores,
                "genderTop": gender_top,
                "deviceAccessTop": device_access_top,
                "internetIntensityTop": internet_intensity_top,
                "educationTop": education_top,
                "socioeconomicTierTop": socioeconomic_tier_top,
                "readingFrequencyTop": reading_frequency_top,
                "readinessScore": round(readiness_score, 1),
            }
        )

    print(f"Writing {OUTPUT_JSON} ...")
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(segments, f, ensure_ascii=False, indent=2)

    print(f"Done. Generated {len(segments)} segments.")


if __name__ == "__main__":
    main()
