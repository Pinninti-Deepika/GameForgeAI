import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)


def load_prompt():
    with open(
        "prompts/level_prompt.txt",
        "r",
        encoding="utf-8"
    ) as file:
        return file.read()


def generate_levels(
    game_plan: dict,
    story: dict,
    characters: dict
):
    level_prompt = load_prompt()

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

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"""
{level_prompt}

Game Plan from the Planner Agent:

{game_plan_json}

Complete Story from the Story Agent:

{story_json}

Characters from the Character Agent:

{characters_json}
"""
    )

    try:
        levels = json.loads(response.text)

        return {
            "success": True,
            "levels": levels
        }

    except Exception:
        return {
            "success": False,
            "levels": {
                "level_overview": {
                    "total_levels": 0,
                    "progression_style": "",
                    "difficulty_flow": ""
                },
                "levels": []
            },
            "raw_response": response.text
        }