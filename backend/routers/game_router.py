from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any

from services.planner_service import generate_game_plan
from services.story_service import generate_story
from services.character_service import generate_characters
from services.level_service import generate_levels
from services.gameplay_service import generate_gameplay
from services.visual_style_service import generate_visual_style
from services.gdd_service import generate_gdd

router = APIRouter()


class GameRequest(BaseModel):
    idea: str


class StoryRequest(BaseModel):
    game_plan: Dict[str, Any]


class CharacterRequest(BaseModel):
    game_plan: Dict[str, Any]
    story: Dict[str, Any]


class LevelRequest(BaseModel):
    game_plan: Dict[str, Any]
    story: Dict[str, Any]
    characters: Dict[str, Any]


class GameplayRequest(BaseModel):
    game_plan: Dict[str, Any]
    story: Dict[str, Any]
    characters: Dict[str, Any]
    levels: Dict[str, Any]


class VisualStyleRequest(BaseModel):
    game_plan: Dict[str, Any]
    story: Dict[str, Any]
    characters: Dict[str, Any]
    levels: Dict[str, Any]
    gameplay: Dict[str, Any]

class GDDRequest(BaseModel):
    game_plan: Dict[str, Any]
    story: Dict[str, Any]
    characters: Dict[str, Any]
    levels: Dict[str, Any]
    gameplay: Dict[str, Any]
    visual_style: Dict[str, Any]




@router.post("/generate-game")
def generate_game(request: GameRequest):
    return generate_game_plan(request.idea)


@router.post("/generate-story")
def create_story(request: StoryRequest):
    return generate_story(request.game_plan)


@router.post("/generate-characters")
def create_characters(request: CharacterRequest):
    return generate_characters(
        request.game_plan,
        request.story
    )


@router.post("/generate-levels")
def create_levels(request: LevelRequest):
    return generate_levels(
        request.game_plan,
        request.story,
        request.characters
    )


@router.post("/generate-gameplay")
def create_gameplay(request: GameplayRequest):
    return generate_gameplay(
        request.game_plan,
        request.story,
        request.characters,
        request.levels
    )


@router.post("/generate-visual-style")
def create_visual_style(request: VisualStyleRequest):
    return generate_visual_style(
        request.game_plan,
        request.story,
        request.characters,
        request.levels,
        request.gameplay
    )

@router.post("/generate-gdd")
def create_gdd(request: GDDRequest):
    return generate_gdd(
        request.game_plan,
        request.story,
        request.characters,
        request.levels,
        request.gameplay,
        request.visual_style
    )


