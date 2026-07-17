from pydantic import BaseModel


class GamePlan(BaseModel):
    title: str
    genre: str
    setting: str
    objective: str
    gameplay: str
    estimated_levels: int
    summary: str