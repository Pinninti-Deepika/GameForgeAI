from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.game_router import router as game_router


app = FastAPI(
    title="GameForge AI",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(game_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to GameForge AI 🚀"
    }