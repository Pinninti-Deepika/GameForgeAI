import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)


def load_prompt():

    with open(
        "prompts/planner_prompt.txt",
        "r",
        encoding="utf-8"
    ) as file:

        return file.read()


def generate_game_plan(game_idea: str):

    planner_prompt = load_prompt()

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"""
{planner_prompt}

Game Idea:

{game_idea}
"""
    )

    try:

        game_plan = json.loads(response.text)

        return {
            "success": True,
            "game_plan": game_plan
        }

    except Exception:

        return {
            "success": False,
            "game_plan": {
                "title": "Parsing Error",
                "genre": "",
                "setting": "",
                "objective": "",
                "gameplay": "",
                "estimated_levels": 0,
                "summary": response.text
            }
        }