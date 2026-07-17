from pydantic import BaseModel


class Character(BaseModel):
    name: str
    story: str
    weapon: str