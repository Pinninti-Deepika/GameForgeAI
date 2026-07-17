import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)


def load_prompt():
    with open(
        "prompts/character_prompt.txt",
        "r",
        encoding="utf-8"
    ) as file:
        return file.read()


def generate_characters(game_plan: dict, story: dict):
    character_prompt = load_prompt()

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

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"""
{character_prompt}

Game Plan from the Planner Agent:

{game_plan_json}

Complete Story from the Story Agent:

{story_json}
"""
    )

    try:
        characters = json.loads(response.text)

        return {
            "success": True,
            "characters": characters
        }

    except Exception:
        return {
            "success": False,
            "characters": {
                "main_character": {},
                "main_antagonist": {},
                "supporting_characters": []
            },
            "raw_response": response.text
        }