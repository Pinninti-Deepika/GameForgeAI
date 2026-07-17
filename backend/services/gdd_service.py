import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)


def load_prompt():
    with open(
        "prompts/gdd_prompt.txt",
        "r",
        encoding="utf-8"
    ) as file:
        return file.read()


def generate_gdd(
    game_plan: dict,
    story: dict,
    characters: dict,
    levels: dict,
    gameplay: dict,
    visual_style: dict
):

    gdd_prompt = load_prompt()

    game_plan_json = json.dumps(
        game_plan,
        indent=2,
        ensure_ascii=False
    )

    story_json = json.dumps(
        story,
        indent=2,
        ensure_ascii=False
    )

    characters_json = json.dumps(
        characters,
        indent=2,
        ensure_ascii=False
    )

    levels_json = json.dumps(
        levels,
        indent=2,
        ensure_ascii=False
    )

    gameplay_json = json.dumps(
        gameplay,
        indent=2,
        ensure_ascii=False
    )

    visual_style_json = json.dumps(
        visual_style,
        indent=2,
        ensure_ascii=False
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"""
{gdd_prompt}

Game Plan

{game_plan_json}

Story

{story_json}

Characters

{characters_json}

Levels

{levels_json}

Gameplay

{gameplay_json}

Visual Style

{visual_style_json}
"""
    )

    try:

        gdd = json.loads(response.text)

        return {
            "success": True,
            "gdd": gdd
        }

    except Exception:

        return {
            "success": False,
            "gdd": {},
            "raw_response": response.text
        }