import os
import json
import re

from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)


def load_prompt():
    with open(
        "prompts/gameplay_prompt.txt",
        "r",
        encoding="utf-8"
    ) as file:
        return file.read()


def extract_json(text: str):
    text = text.strip()

    # Remove markdown fences
    text = re.sub(r"^```json\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"\s*```$", "", text)

    # Keep only the JSON object
    start = text.find("{")
    end = text.rfind("}")

    if start != -1 and end != -1:
        text = text[start:end + 1]

    # First attempt
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Remove trailing commas
    text = re.sub(r",(\s*[}\]])", r"\1", text)

    # Second attempt
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Print the exact line that failed
    try:
        json.loads(text)
    except json.JSONDecodeError as e:
        print("\n========== GAMEPLAY JSON ERROR ==========")
        print(e)

        lines = text.splitlines()
        start_line = max(e.lineno - 3, 0)
        end_line = min(e.lineno + 2, len(lines))

        print("\nProblem Area:\n")
        for i in range(start_line, end_line):
            marker = ">>" if i + 1 == e.lineno else "  "
            print(f"{marker} {i + 1}: {lines[i]}")

        raise


def generate_gameplay(
    game_plan: dict,
    story: dict,
    characters: dict,
    levels: dict
):
    gameplay_prompt = load_prompt()

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

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"""
{gameplay_prompt}

Game Plan from the Planner Agent:

{game_plan_json}

Complete Story from the Story Agent:

{story_json}

Characters from the Character Agent:

{characters_json}

Levels from the Level Agent:

{levels_json}
"""
    )

    try:
        gameplay = extract_json(response.text)

        return {
            "success": True,
            "gameplay": gameplay
        }

    except Exception:
        print("\n========== RAW GEMINI RESPONSE ==========\n")
        print(response.text)
        print("\n=========================================\n")

        return {
            "success": False,
            "gameplay": {
                "gameplay_overview": {},
                "player_actions": [],
                "gameplay_systems": [],
                "progression_system": {},
                "rewards_system": {},
                "failure_conditions": [],
                "controls_and_interactions": []
            },
            "raw_response": response.text
        }