import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const savedGamePlan = sessionStorage.getItem("gamePlan");
  const savedIdea = sessionStorage.getItem("gameIdea");

  const [idea, setIdea] = useState(savedIdea || "");
  const [gamePlan, setGamePlan] = useState(
    savedGamePlan ? JSON.parse(savedGamePlan) : null
  );
  const [loading, setLoading] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  const quickIdeas = [
    "Fantasy RPG",
    "Horror",
    "Sci-Fi",
    "Zombie Survival",
    "Detective",
    "Medieval",
  ];

  const generateGamePlan = async () => {
    if (!idea.trim()) {
      alert("Please enter a game idea.");
      return;
    }

    setLoading(true);
    setGamePlan(null);
    setSummaryExpanded(false);

    // A new game idea starts a completely new project.
    sessionStorage.removeItem("gamePlan");
    sessionStorage.removeItem("story");
    sessionStorage.removeItem("characters");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/generate-game",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idea: idea,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setGamePlan(data.game_plan);

        sessionStorage.setItem("gameIdea", idea);
        sessionStorage.setItem(
          "gamePlan",
          JSON.stringify(data.game_plan)
        );
      } else {
        alert("The AI could not generate the game plan.");
      }
    } catch (error) {
      console.error("Error generating game plan:", error);

      alert(
        "Could not connect to the backend. Make sure the FastAPI server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const continueToStory = () => {
    if (!gamePlan) {
      alert("Please generate a game plan first.");
      return;
    }

    navigate("/story", {
      state: {
        gamePlan: gamePlan,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* PAGE TITLE */}

        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-3">
            Create Your Next Game
          </h1>

          <p className="text-gray-400">
            Transform your imagination into a professional Game Design Plan.
          </p>
        </div>

        {/* PLANNER WORKSPACE */}

        <div className="grid lg:grid-cols-2 gap-8">

          {/* LEFT PANEL */}

          <div className="bg-[#151A2D] rounded-3xl p-7 border border-gray-800">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-semibold">
                💡 Game Idea
              </h2>

              <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
                Step 1
              </span>
            </div>

            <textarea
              rows="8"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Example:
A detective searches for a kidnapped child inside a haunted hospital..."
              className="w-full rounded-xl bg-[#0F172A] border border-purple-600 p-5 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <h3 className="mt-6 mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Quick Ideas
            </h3>

            <div className="flex flex-wrap gap-2">
              {quickIdeas.map((item) => (
                <button
                  key={item}
                  onClick={() => setIdea(item)}
                  disabled={loading}
                  className="bg-[#0F172A] border border-gray-700 hover:border-purple-500 hover:bg-purple-600 disabled:opacity-50 transition px-4 py-2 rounded-full text-sm"
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              onClick={generateGamePlan}
              disabled={loading}
              className="mt-7 w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition rounded-xl py-4 text-lg font-semibold shadow-lg shadow-purple-700/30"
            >
              {loading
                ? "🧠 Planner Agent is Working..."
                : "✨ Generate Game Plan"}
            </button>

            <p className="text-center text-gray-500 text-xs mt-3">
              Powered by Gemini 2.5 Flash
            </p>
          </div>

          {/* GAME OVERVIEW */}

          <div className="bg-[#151A2D] rounded-3xl p-7 border border-gray-800">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-semibold">
                🎮 AI Game Overview
              </h2>

              {gamePlan ? (
                <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400">
                  ✓ Planner Complete
                </span>
              ) : (
                <span className="text-xs px-3 py-1 rounded-full bg-gray-500/10 border border-gray-700 text-gray-500">
                  Waiting
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">

              {/* TITLE */}

              <div className="bg-[#0F172A] rounded-xl p-4 border border-gray-700">
                <p className="text-xs text-purple-400 mb-1">
                  TITLE
                </p>

                <p
                  className={
                    gamePlan
                      ? "font-semibold"
                      : "text-gray-500"
                  }
                >
                  {gamePlan
                    ? gamePlan.title
                    : "Waiting for your idea"}
                </p>
              </div>

              {/* GENRE */}

              <div className="bg-[#0F172A] rounded-xl p-4 border border-gray-700">
                <p className="text-xs text-purple-400 mb-1">
                  GENRE
                </p>

                <p
                  className={
                    gamePlan
                      ? "text-gray-200"
                      : "text-gray-500"
                  }
                >
                  {gamePlan
                    ? gamePlan.genre
                    : "Not generated"}
                </p>
              </div>

              {/* LEVELS */}

              <div className="bg-[#0F172A] rounded-xl p-4 border border-gray-700">
                <p className="text-xs text-purple-400 mb-1">
                  LEVELS
                </p>

                <p
                  className={
                    gamePlan
                      ? "text-gray-200"
                      : "text-gray-500"
                  }
                >
                  {gamePlan
                    ? gamePlan.estimated_levels
                    : "—"}
                </p>
              </div>

              {/* STATUS */}

              <div className="bg-[#0F172A] rounded-xl p-4 border border-gray-700">
                <p className="text-xs text-purple-400 mb-1">
                  STATUS
                </p>

                <p
                  className={
                    gamePlan
                      ? "text-green-400"
                      : "text-gray-500"
                  }
                >
                  {gamePlan
                    ? "Ready for Story"
                    : "Waiting"}
                </p>
              </div>

            </div>

            {/* SETTING */}

            <div className="mt-3 bg-[#0F172A] rounded-xl p-4 border border-gray-700">
              <p className="text-xs text-purple-400 mb-2">
                SETTING
              </p>

              <p
                className={
                  gamePlan
                    ? "text-gray-300"
                    : "text-gray-500"
                }
              >
                {gamePlan
                  ? gamePlan.setting
                  : "Your game world will appear here."}
              </p>
            </div>

            {/* OBJECTIVE */}

            <div className="mt-3 bg-[#0F172A] rounded-xl p-4 border border-gray-700">
              <p className="text-xs text-purple-400 mb-2">
                OBJECTIVE
              </p>

              <p
                className={
                  gamePlan
                    ? "text-gray-300"
                    : "text-gray-500"
                }
              >
                {gamePlan
                  ? gamePlan.objective
                  : "The main objective will appear here."}
              </p>
            </div>

            {/* GAMEPLAY */}

            <div className="mt-3 bg-[#0F172A] rounded-xl p-4 border border-gray-700">
              <p className="text-xs text-purple-400 mb-2">
                GAMEPLAY
              </p>

              <p
                className={
                  gamePlan
                    ? "text-gray-300"
                    : "text-gray-500"
                }
              >
                {gamePlan
                  ? gamePlan.gameplay
                  : "The gameplay style will appear here."}
              </p>
            </div>

            {/* SUMMARY */}

            <div className="mt-3 bg-[#0F172A] rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-purple-400">
                  GAME SUMMARY
                </p>

                {gamePlan && (
                  <button
                    onClick={() =>
                      setSummaryExpanded(!summaryExpanded)
                    }
                    className="text-xs text-purple-400 hover:text-purple-300 transition"
                  >
                    {summaryExpanded
                      ? "Show Less ↑"
                      : "Read Full ↓"}
                  </button>
                )}
              </div>

              <div
                className={
                  summaryExpanded
                    ? ""
                    : "max-h-20 overflow-hidden"
                }
              >
                <p
                  className={
                    gamePlan
                      ? "text-gray-300 leading-6"
                      : "text-gray-500"
                  }
                >
                  {gamePlan
                    ? gamePlan.summary
                    : "A short overview of your game will appear here."}
                </p>
              </div>

              {!summaryExpanded && gamePlan && (
                <div className="h-8 -mt-8 relative bg-gradient-to-t from-[#0F172A] to-transparent pointer-events-none" />
              )}
            </div>

            {/* CONTINUE TO STORY */}

            {gamePlan && (
              <div className="mt-5">
                <button
                  onClick={continueToStory}
                  className="w-full bg-purple-600 hover:bg-purple-700 transition rounded-xl py-4 text-lg font-semibold shadow-lg shadow-purple-700/30"
                >
                  Continue to Story
                  <span className="ml-2">→</span>
                </button>

                <p className="text-center text-gray-500 text-xs mt-3">
                  Next: Story Agent will build your complete game story
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;