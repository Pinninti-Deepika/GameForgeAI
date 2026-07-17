import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)


def load_prompt():

    with open(
        "prompts/story_prompt.txt",
        "r",
        encoding="utf-8"
    ) as file:

        return file.read()


def generate_story(game_plan: dict):

    story_prompt = load_prompt()

    game_plan_json = json.dumps(
        game_plan,
        indent=2,
        ensure_ascii=False
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"""
{story_prompt}

Game Plan from the Planner Agent:

{game_plan_json}
"""
    )

    try:

        story = json.loads(response.text)

        return {
            "success": True,
            "story": story
        }

    except Exception:

        return {
            "success": False,
            "story": {
                "beginning": "",
                "rising_action": "",
                "midpoint": "",
                "climax": "",
                "ending": "",
                "plot_twist": "",
                "raw_response": response.text
            }
        }