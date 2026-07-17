import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Reuse the same request if React remounts
// while level generation is still running.
let levelRequestPromise = null;

function Levels() {
  const location = useLocation();
  const navigate = useNavigate();

  const [gamePlan] = useState(() => {
    if (location.state?.gamePlan) {
      return location.state.gamePlan;
    }

    const savedGamePlan =
      sessionStorage.getItem("gamePlan");

    return savedGamePlan
      ? JSON.parse(savedGamePlan)
      : null;
  });

  const [story] = useState(() => {
    if (location.state?.story) {
      return location.state.story;
    }

    const savedStory =
      sessionStorage.getItem("story");

    return savedStory
      ? JSON.parse(savedStory)
      : null;
  });

  const [characters] = useState(() => {
    if (location.state?.characters) {
      return location.state.characters;
    }

    const savedCharacters =
      sessionStorage.getItem("characters");

    return savedCharacters
      ? JSON.parse(savedCharacters)
      : null;
  });

  const [levelData, setLevelData] = useState(() => {
    const savedLevels =
      sessionStorage.getItem("levels");

    return savedLevels
      ? JSON.parse(savedLevels)
      : null;
  });

  const [loading, setLoading] = useState(
    () => !sessionStorage.getItem("levels")
  );

  const [activeLevelIndex, setActiveLevelIndex] =
    useState(0);

  const [activeStep, setActiveStep] = useState(0);

  const hasStartedGeneration = useRef(false);

  const loadingSteps = [
    {
      icon: "🗺️",
      text: "Studying the game world...",
    },
    {
      icon: "🎯",
      text: "Creating level objectives...",
    },
    {
      icon: "⚔️",
      text: "Designing challenges...",
    },
    {
      icon: "📈",
      text: "Building difficulty progression...",
    },
    {
      icon: "🏆",
      text: "Preparing the final level...",
    },
  ];

  const levels = levelData?.levels || [];
  const overview =
    levelData?.level_overview || null;

  const activeLevel =
    levels[activeLevelIndex];

  useEffect(() => {
    if (!gamePlan || !story || !characters) {
      navigate("/generate");
      return;
    }

    if (levelData) {
      setLoading(false);
      return;
    }

    if (hasStartedGeneration.current) {
      return;
    }

    hasStartedGeneration.current = true;

    const generateLevels = async () => {
      setLoading(true);

      try {
        if (!levelRequestPromise) {
          levelRequestPromise = fetch(
  `${import.meta.env.VITE_API_URL}/generate-levels`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                game_plan: gamePlan,
                story: story,
                characters: characters,
              }),
            }
          )
            .then(async (response) => {
              if (!response.ok) {
                throw new Error(
                  `Level request failed: ${response.status}`
                );
              }

              return response.json();
            })
            .finally(() => {
              levelRequestPromise = null;
            });
        }

        const data =
          await levelRequestPromise;

        if (data.success) {
          sessionStorage.setItem(
            "levels",
            JSON.stringify(data.levels)
          );

          setLevelData(data.levels);
        } else {
          alert(
            "The Level Agent could not generate the levels."
          );

          navigate("/characters");
        }
      } catch (error) {
        console.error(
          "Level generation error:",
          error
        );

        alert(
          "Could not connect to the Level Agent. Please try again."
        );

        navigate("/characters");
      } finally {
        setLoading(false);
      }
    };

    generateLevels();
  }, [
    gamePlan,
    story,
    characters,
    levelData,
    navigate,
  ]);

  useEffect(() => {
    if (!loading) {
      return;
    }

    const interval = setInterval(() => {
      setActiveStep((currentStep) => {
        if (
          currentStep <
          loadingSteps.length - 1
        ) {
          return currentStep + 1;
        }

        return currentStep;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [loading, loadingSteps.length]);

  const goToPreviousLevel = () => {
    if (activeLevelIndex > 0) {
      setActiveLevelIndex(
        activeLevelIndex - 1
      );
    }
  };

  const goToNextLevel = () => {
    if (
      activeLevelIndex <
      levels.length - 1
    ) {
      setActiveLevelIndex(
        activeLevelIndex + 1
      );
    }
  };

  const continueToGameplay = () => {
    if (!levelData) {
      alert(
        "Please generate the levels first."
      );
      return;
    }

    navigate("/gameplay", {
      state: {
        gamePlan: gamePlan,
        story: story,
        characters: characters,
        levels: levelData,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B14] text-white flex items-center justify-center px-6 overflow-hidden relative">

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
          className="absolute w-[500px] h-[500px] bg-purple-700/20 blur-[120px] rounded-full"
        />

        <motion.div
          animate={{
            x: [-80, 80, -80],
            y: [30, -50, 30],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
          }}
          className="absolute top-20 left-20 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full"
        />

        <div className="relative z-10 text-center max-w-2xl w-full">

          <div className="relative w-40 h-40 mx-auto mb-10 flex items-center justify-center">

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-full border border-purple-500/40 border-t-purple-400"
            />

            <motion.div
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-4 rounded-full border border-blue-500/30 border-b-blue-400"
            />

            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                boxShadow: [
                  "0 0 20px rgba(168, 85, 247, 0.3)",
                  "0 0 60px rgba(168, 85, 247, 0.8)",
                  "0 0 20px rgba(168, 85, 247, 0.3)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-4xl"
            >
              🗺️
            </motion.div>

          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-purple-400 text-sm font-semibold tracking-[0.3em] mb-4"
          >
            LEVEL AGENT ACTIVE
          </motion.p>

          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Your game journey is being built...
          </motion.h1>

          <p className="text-gray-400 mb-10">
            The Level Agent is turning your story into playable stages.
          </p>

          <div className="h-16 flex items-center justify-center">

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -15,
                }}
                transition={{
                  duration: 0.4,
                }}
                className="flex items-center gap-3 text-lg"
              >
                <span className="text-2xl">
                  {
                    loadingSteps[activeStep]
                      .icon
                  }
                </span>

                <span className="text-gray-200">
                  {
                    loadingSteps[activeStep]
                      .text
                  }
                </span>
              </motion.div>
            </AnimatePresence>

          </div>

          <div className="flex justify-center gap-3 mt-6">

            {loadingSteps.map(
              (step, index) => (
                <motion.div
                  key={step.text}
                  animate={{
                    width:
                      index === activeStep
                        ? 32
                        : 8,
                    backgroundColor:
                      index <= activeStep
                        ? "#a855f7"
                        : "#374151",
                  }}
                  className="h-2 rounded-full"
                />
              )
            )}

          </div>

        </div>
      </div>
    );
  }

  if (!activeLevel || !overview) {
    return null;
  }

  const levelNumber = String(
    activeLevel.level_number
  ).padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-5 md:px-8 py-7">

      <div className="max-w-7xl mx-auto">

        {/* TOP BAR */}

        <div className="flex items-center justify-between mb-8">

          <button
            onClick={() =>
              navigate("/characters")
            }
            className="text-gray-400 hover:text-white transition"
          >
            ← Back to Characters
          </button>

          <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            ✓ Level Agent Complete
          </div>

        </div>

        {/* PAGE HEADER */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center mb-8"
        >
          <p className="text-purple-400 text-sm font-semibold tracking-[0.3em] mb-3">
            LEVEL DESIGN STUDIO
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            {gamePlan.title}
          </h1>

          <p className="text-gray-400">
            Explore the complete playable journey of your game.
          </p>
        </motion.div>

        {/* COMPACT OVERVIEW */}

        <div className="grid md:grid-cols-[180px_1fr_1fr] gap-3 mb-5">

          <div className="bg-[#151A2D] border border-gray-800 rounded-2xl px-5 py-4">

            <p className="text-[11px] text-purple-400 tracking-wider mb-2">
              TOTAL LEVELS
            </p>

            <div className="flex items-end gap-2">

              <p className="text-3xl font-bold">
                {overview.total_levels}
              </p>

              <p className="text-gray-500 text-sm mb-1">
                stages
              </p>

            </div>

          </div>

          <div className="bg-[#151A2D] border border-gray-800 rounded-2xl px-5 py-4">

            <p className="text-[11px] text-purple-400 tracking-wider mb-2">
              PROGRESSION STYLE
            </p>

            <p className="text-gray-300 text-sm leading-6">
              {overview.progression_style}
            </p>

          </div>

          <div className="bg-[#151A2D] border border-gray-800 rounded-2xl px-5 py-4">

            <p className="text-[11px] text-purple-400 tracking-wider mb-2">
              DIFFICULTY FLOW
            </p>

            <p className="text-gray-300 text-sm leading-6">
              {overview.difficulty_flow}
            </p>

          </div>

        </div>

        {/* LEVEL JOURNEY */}

        <div className="bg-[#151A2D] border border-gray-800 rounded-2xl px-5 py-4 mb-5">

          <div className="flex flex-col lg:flex-row lg:items-center gap-4">

            <div className="lg:w-40 shrink-0">

              <p className="text-xs text-purple-400 font-semibold tracking-[0.25em]">
                LEVEL JOURNEY
              </p>

              <p className="text-gray-500 text-xs mt-1">
                Select a stage
              </p>

            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">

              {levels.map(
                (level, index) => (
                  <div
                    key={
                      level.level_number
                    }
                    className="flex items-center shrink-0"
                  >

                    <button
                      onClick={() =>
                        setActiveLevelIndex(
                          index
                        )
                      }
                      className={
                        activeLevelIndex ===
                        index
                          ? "w-12 h-12 rounded-xl bg-purple-600 border border-purple-400 font-bold shadow-lg shadow-purple-700/30 transition"
                          : "w-12 h-12 rounded-xl bg-[#0F172A] border border-gray-700 hover:border-purple-500 font-bold text-gray-500 hover:text-white transition"
                      }
                    >
                      {String(
                        level.level_number
                      ).padStart(2, "0")}
                    </button>

                    {index <
                      levels.length - 1 && (
                      <div className="w-5 h-px bg-gray-700 mx-1" />
                    )}

                  </div>
                )
              )}

            </div>

          </div>

        </div>

        {/* ACTIVE LEVEL */}

        <AnimatePresence mode="wait">

          <motion.div
            key={activeLevel.level_number}
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.25,
            }}
            className="bg-[#151A2D] border border-gray-800 rounded-3xl overflow-hidden"
          >

            {/* LEVEL HERO */}

            <div className="relative px-6 md:px-8 py-6 border-b border-gray-800 overflow-hidden">

              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full" />

              <span className="absolute right-7 top-1/2 -translate-y-1/2 text-[110px] font-black text-white/[0.025] leading-none">
                {levelNumber}
              </span>

              <div className="relative">

                <div className="flex items-center gap-3 mb-3">

                  <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold tracking-wider">
                    LEVEL {levelNumber}
                  </span>

                  <span className="text-gray-600 text-sm">
                    {activeLevelIndex + 1} /{" "}
                    {levels.length}
                  </span>

                </div>

                <h2 className="text-3xl md:text-4xl font-bold">
                  {activeLevel.level_name}
                </h2>

                <div className="flex items-center gap-2 mt-3 text-gray-400">

                  <span>📍</span>

                  <p className="text-sm md:text-base">
                    {activeLevel.location}
                  </p>

                </div>

              </div>

            </div>

            {/* MISSION CONTENT */}

            <div className="p-5 md:p-7">

              <div className="grid lg:grid-cols-2 gap-4">

                {/* LEFT COLUMN */}

                <div className="space-y-4">

                  {/* MAIN OBJECTIVE */}

                  <div className="bg-[#0F172A] border border-purple-500/20 rounded-2xl p-5">

                    <div className="flex items-center gap-3 mb-3">

                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        🎯
                      </div>

                      <p className="text-xs text-purple-400 font-semibold tracking-wider">
                        MAIN OBJECTIVE
                      </p>

                    </div>

                    <p className="text-gray-200 leading-7">
                      {
                        activeLevel.main_objective
                      }
                    </p>

                  </div>

                  {/* STORY EVENT */}

                  <div className="bg-[#0F172A] border border-gray-800 rounded-2xl p-5">

                    <div className="flex items-center gap-3 mb-3">

                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        📖
                      </div>

                      <p className="text-xs text-purple-400 font-semibold tracking-wider">
                        STORY EVENT
                      </p>

                    </div>

                    <p className="text-gray-300 leading-7">
                      {activeLevel.story_event}
                    </p>

                  </div>

                  {/* GAMEPLAY FOCUS */}

                  <div className="bg-[#0F172A] border border-gray-800 rounded-2xl p-5">

                    <div className="flex items-center gap-3 mb-3">

                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        🎮
                      </div>

                      <p className="text-xs text-purple-400 font-semibold tracking-wider">
                        GAMEPLAY FOCUS
                      </p>

                    </div>

                    <p className="text-gray-300 leading-7">
                      {
                        activeLevel.gameplay_focus
                      }
                    </p>

                  </div>

                </div>

                {/* RIGHT COLUMN */}

                <div className="space-y-4">

                  {/* CHALLENGES */}

                  <div className="bg-[#0F172A] border border-gray-800 rounded-2xl p-5">

                    <div className="flex items-center justify-between mb-4">

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
                          ⚔️
                        </div>

                        <p className="text-xs text-purple-400 font-semibold tracking-wider">
                          CHALLENGES
                        </p>

                      </div>

                      <span className="text-xs text-gray-600">
                        {activeLevel
                          .challenges?.length ||
                          0}{" "}
                        TASKS
                      </span>

                    </div>

                    <div className="space-y-3">

                      {activeLevel.challenges?.map(
                        (
                          challenge,
                          index
                        ) => (
                          <div
                            key={`${challenge}-${index}`}
                            className="flex items-start gap-3"
                          >

                            <div className="w-7 h-7 shrink-0 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold">
                              {String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </div>

                            <p className="text-gray-300 text-sm leading-6 pt-0.5">
                              {challenge}
                            </p>

                          </div>
                        )
                      )}

                    </div>

                  </div>

                  {/* CHARACTERS */}

                  <div className="bg-[#0F172A] border border-gray-800 rounded-2xl p-5">

                    <div className="flex items-center gap-3 mb-4">

                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        👥
                      </div>

                      <p className="text-xs text-purple-400 font-semibold tracking-wider">
                        CHARACTERS INVOLVED
                      </p>

                    </div>

                    <div className="flex flex-wrap gap-2">

                      {activeLevel.characters_involved?.map(
                        (character) => (
                          <span
                            key={character}
                            className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm"
                          >
                            {character}
                          </span>
                        )
                      )}

                    </div>

                  </div>

                </div>

              </div>

              {/* LEVEL ENDING */}

              <div className="relative mt-4 bg-gradient-to-r from-purple-950/40 to-[#0F172A] border border-purple-500/30 rounded-2xl p-5 md:p-6 overflow-hidden">

                <div className="absolute right-0 top-0 w-56 h-56 bg-purple-600/10 blur-[80px] rounded-full" />

                <div className="relative flex flex-col md:flex-row md:items-start gap-4">

                  <div className="w-11 h-11 shrink-0 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-xl">
                    🚪
                  </div>

                  <div>

                    <p className="text-xs text-purple-400 font-semibold tracking-wider mb-2">
                      LEVEL ENDING
                    </p>

                    <p className="text-gray-200 leading-7">
                      {
                        activeLevel.level_ending
                      }
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </motion.div>

        </AnimatePresence>

        {/* LEVEL NAVIGATION */}

        <div className="flex items-center justify-between mt-5">

          <button
            onClick={goToPreviousLevel}
            disabled={activeLevelIndex === 0}
            className="px-5 py-3 rounded-xl bg-[#151A2D] border border-gray-800 hover:border-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            ← Previous Level
          </button>

          <div className="hidden sm:flex items-center gap-2">

            {levels.map(
              (level, index) => (
                <div
                  key={level.level_number}
                  className={
                    activeLevelIndex === index
                      ? "w-6 h-1.5 rounded-full bg-purple-500 transition"
                      : "w-1.5 h-1.5 rounded-full bg-gray-700 transition"
                  }
                />
              )
            )}

          </div>

          <button
            onClick={goToNextLevel}
            disabled={
              activeLevelIndex ===
              levels.length - 1
            }
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Next Level →
          </button>

        </div>

        {/* CONTINUE TO GAMEPLAY AGENT */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
          }}
          className="mt-8 bg-[#151A2D] border border-purple-500/30 rounded-3xl p-6 md:p-8"
        >

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div>

              <p className="text-purple-400 text-xs font-semibold tracking-[0.3em] mb-2">
                NEXT DESIGN STAGE
              </p>

              <h2 className="text-2xl font-bold mb-2">
                Turn Your Levels Into Real Gameplay
              </h2>

              <p className="text-gray-400 max-w-3xl">
                Let the Gameplay Agent design the player actions,
                core mechanics, combat, progression, and game loop.
              </p>

            </div>

            <button
              onClick={continueToGameplay}
              className="shrink-0 px-7 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold transition shadow-lg shadow-purple-700/30"
            >
              Continue to Gameplay →
            </button>

          </div>

        </motion.div>

      </div>
    </div>
  );
}

export default Levels;
