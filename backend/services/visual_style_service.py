import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)


def load_prompt():
    with open(
        "prompts/visual_style_prompt.txt",
        "r",
        encoding="utf-8"
    ) as file:
        return file.read()


def generate_visual_style(
    game_plan: dict,
    story: dict,
    characters: dict,
    levels: dict,
    gameplay: dict
):
    visual_style_prompt = load_prompt()

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

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"""
{visual_style_prompt}

Game Plan from the Planner Agent:

{game_plan_json}

Complete Story from the Story Agent:

{story_json}

Characters from the Character Agent:

{characters_json}

Levels from the Level Agent:

{levels_json}

Gameplay Systems from the Gameplay Mechanics Agent:

{gameplay_json}
"""
    )

    try:
        visual_style = json.loads(response.text)

        return {
            "success": True,
            "visual_style": visual_style
        }

    except Exception:
        return {
            "success": False,
            "visual_style": {
                "visual_overview": {},
                "color_direction": {},
                "lighting_and_atmosphere": {},
                "environment_design": {
                    "overall_direction": "",
                    "important_locations": []
                },
                "character_visual_direction": [],
                "enemy_and_creature_design": {},
                "visual_effects": [],
                "camera_and_presentation": {},
                "ui_and_hud_style": {}
            },
            "raw_response": response.text
        }