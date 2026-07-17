import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Reuse the same request if React remounts
// while gameplay generation is still running.
let gameplayRequestPromise = null;

function Gameplay() {
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

  const [levels] = useState(() => {
    if (location.state?.levels) {
      return location.state.levels;
    }

    const savedLevels =
      sessionStorage.getItem("levels");

    return savedLevels
      ? JSON.parse(savedLevels)
      : null;
  });

  const [gameplay, setGameplay] = useState(() => {
    const savedGameplay =
      sessionStorage.getItem("gameplay");

    return savedGameplay
      ? JSON.parse(savedGameplay)
      : null;
  });

  const [loading, setLoading] = useState(
    () => !sessionStorage.getItem("gameplay")
  );

  const [activeStep, setActiveStep] = useState(0);

  const [activeSection, setActiveSection] =
    useState("overview");

  const hasStartedGeneration = useRef(false);

  const loadingSteps = [
    {
      icon: "🎮",
      text: "Studying the complete game journey...",
    },
    {
      icon: "🧠",
      text: "Finding the right gameplay systems...",
    },
    {
      icon: "⚡",
      text: "Designing player actions...",
    },
    {
      icon: "📈",
      text: "Building progression and rewards...",
    },
    {
      icon: "✨",
      text: "Connecting gameplay to every level...",
    },
  ];

  useEffect(() => {
    if (
      !gamePlan ||
      !story ||
      !characters ||
      !levels
    ) {
      navigate("/generate");
      return;
    }

    // Gameplay already exists.
    // Do not call the backend again.
    if (gameplay) {
      setLoading(false);
      return;
    }

    // Stop this component from starting
    // generation twice.
    if (hasStartedGeneration.current) {
      return;
    }

    hasStartedGeneration.current = true;

    const generateGameplay = async () => {
      setLoading(true);

      try {
        if (!gameplayRequestPromise) {
          gameplayRequestPromise = fetch(
            "http://127.0.0.1:8000/generate-gameplay",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                game_plan: gamePlan,
                story: story,
                characters: characters,
                levels: levels,
              }),
            }
          )
            .then(async (response) => {
              if (!response.ok) {
                throw new Error(
                  `Gameplay request failed: ${response.status}`
                );
              }

              return response.json();
            })
            .finally(() => {
              gameplayRequestPromise = null;
            });
        }

        const data = await gameplayRequestPromise;

        if (data.success) {
          sessionStorage.setItem(
            "gameplay",
            JSON.stringify(data.gameplay)
          );

          setGameplay(data.gameplay);
        } else {
          console.error(
            "Gameplay Agent raw response:",
            data.raw_response
          );

          alert(
            "The Gameplay Agent could not generate the gameplay design."
          );

          navigate("/levels");
        }
      } catch (error) {
        console.error(
          "Gameplay generation error:",
          error
        );

        alert(
          "Could not connect to the Gameplay Agent. Make sure the backend is running."
        );

        navigate("/levels");
      } finally {
        setLoading(false);
      }
    };

    generateGameplay();
  }, [
    gamePlan,
    story,
    characters,
    levels,
    gameplay,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B14] text-white flex items-center justify-center px-6 overflow-hidden relative">

        {/* BACKGROUND GLOW */}

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
          className="absolute top-20 right-20 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full"
        />

        {/* LOADING CONTENT */}

        <div className="relative z-10 text-center max-w-2xl w-full">

          {/* ANIMATED ORB */}

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
              🎮
            </motion.div>

          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-purple-400 text-sm font-semibold tracking-[0.3em] mb-4"
          >
            GAMEPLAY AGENT ACTIVE
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
            Your game is becoming playable...
          </motion.h1>

          <p className="text-gray-400 mb-10">
            The Gameplay Agent is turning your game
            journey into connected player systems.
          </p>

          {/* CHANGING STATUS */}

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
                  {loadingSteps[activeStep].icon}
                </span>

                <span className="text-gray-200">
                  {loadingSteps[activeStep].text}
                </span>
              </motion.div>
            </AnimatePresence>

          </div>

          {/* PROGRESS */}

          <div className="flex justify-center gap-3 mt-6">

            {loadingSteps.map((step, index) => (
              <motion.div
                key={step.text}
                animate={{
                  width:
                    index === activeStep ? 32 : 8,
                  backgroundColor:
                    index <= activeStep
                      ? "#a855f7"
                      : "#374151",
                }}
                className="h-2 rounded-full"
              />
            ))}

          </div>

        </div>
      </div>
    );
  }

  if (!gameplay) {
    return null;
  }

  const overview =
    gameplay.gameplay_overview || {};

  const playerActions =
    gameplay.player_actions || [];

  const gameplaySystems =
    gameplay.gameplay_systems || [];

  const progression =
    gameplay.progression_system || {};

  const rewards =
    gameplay.rewards_system || {};

  const failureConditions =
    gameplay.failure_conditions || [];

  const controls =
    gameplay.controls_and_interactions || [];

  const sections = [
    {
      id: "overview",
      label: "Overview",
      icon: "🎮",
      count: null,
    },
    {
      id: "actions",
      label: "Player Actions",
      icon: "⚡",
      count: playerActions.length,
    },
    {
      id: "systems",
      label: "Game Systems",
      icon: "🧠",
      count: gameplaySystems.length,
    },
    {
      id: "progression",
      label: "Progression",
      icon: "📈",
      count: null,
    },
    {
      id: "rewards",
      label: "Rewards",
      icon: "🏆",
      count: rewards.main_rewards?.length || 0,
    },
    {
      id: "failure",
      label: "Failure",
      icon: "⚠️",
      count: failureConditions.length,
    },
    {
      id: "controls",
      label: "Interactions",
      icon: "🎯",
      count: controls.length,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-5 md:px-8 py-7">

      <div className="max-w-7xl mx-auto">

        {/* TOP BAR */}

        <div className="flex items-center justify-between mb-8">

          <button
            onClick={() => navigate("/levels")}
            className="text-gray-400 hover:text-white transition"
          >
            ← Back to Levels
          </button>

          <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            ✓ Gameplay Agent Complete
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
            GAMEPLAY STUDIO
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            {gamePlan.title}
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore how the player moves, acts,
            progresses, and experiences your game.
          </p>

        </motion.div>

        {/* GAMEPLAY SUMMARY */}

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-4 mb-5">

          {/* GAMEPLAY STYLE */}

          <div className="relative bg-[#151A2D] border border-purple-500/20 rounded-2xl p-5 overflow-hidden">

            <div className="absolute top-0 right-0 w-52 h-52 bg-purple-600/10 blur-[80px] rounded-full" />

            <div className="relative">

              <div className="flex items-center gap-3 mb-3">

                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  🎮
                </div>

                <p className="text-xs text-purple-400 font-semibold tracking-wider">
                  GAMEPLAY STYLE
                </p>

              </div>

              <p className="text-gray-200 leading-7">
                {overview.gameplay_style}
              </p>

            </div>

          </div>

          {/* PLAYER EXPERIENCE */}

          <div className="bg-[#151A2D] border border-gray-800 rounded-2xl p-5">

            <div className="flex items-center gap-3 mb-3">

              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                ✨
              </div>

              <p className="text-xs text-purple-400 font-semibold tracking-wider">
                PLAYER EXPERIENCE
              </p>

            </div>

            <p className="text-gray-300 leading-7">
              {overview.player_experience}
            </p>

          </div>

        </div>

        {/* SECTION NAVIGATION */}

        <div className="bg-[#151A2D] border border-gray-800 rounded-2xl p-3 mb-5">

          <div className="flex gap-2 overflow-x-auto">

            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() =>
                  setActiveSection(section.id)
                }
                className={
                  activeSection === section.id
                    ? "shrink-0 px-4 py-3 rounded-xl bg-purple-600 border border-purple-400 text-white transition"
                    : "shrink-0 px-4 py-3 rounded-xl bg-[#0F172A] border border-gray-800 text-gray-400 hover:text-white hover:border-purple-500 transition"
                }
              >

                <div className="flex items-center gap-2">

                  <span>{section.icon}</span>

                  <span className="text-sm font-semibold">
                    {section.label}
                  </span>

                  {section.count !== null && (
                    <span
                      className={
                        activeSection === section.id
                          ? "px-2 py-0.5 rounded-full bg-white/10 text-xs"
                          : "px-2 py-0.5 rounded-full bg-white/5 text-gray-500 text-xs"
                      }
                    >
                      {section.count}
                    </span>
                  )}

                </div>

              </button>
            ))}

          </div>

        </div>

        {/* ACTIVE SECTION */}

        <AnimatePresence mode="wait">

          <motion.div
            key={activeSection}
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
          >

            {/* OVERVIEW */}

            {activeSection === "overview" && (
              <div className="bg-[#151A2D] border border-gray-800 rounded-3xl p-6 md:p-8">

                <div className="flex items-center justify-between gap-4 mb-7">

                  <div>

                    <p className="text-purple-400 text-xs font-semibold tracking-[0.25em] mb-2">
                      CORE EXPERIENCE
                    </p>

                    <h2 className="text-2xl md:text-3xl font-bold">
                      Core Gameplay Loop
                    </h2>

                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl">
                    🔁
                  </div>

                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

                  {overview.core_gameplay_loop?.map(
                    (step, index) => (
                      <div
                        key={`${step}-${index}`}
                        className="relative bg-[#0F172A] border border-gray-800 rounded-2xl p-5"
                      >

                        <div className="flex items-center justify-between mb-4">

                          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </div>

                          {index <
                            overview.core_gameplay_loop
                              .length -
                              1 && (
                            <span className="text-gray-700 text-xl">
                              →
                            </span>
                          )}

                        </div>

                        <p className="text-gray-200 leading-7">
                          {step}
                        </p>

                      </div>
                    )
                  )}

                </div>

                <div className="mt-5 bg-purple-950/20 border border-purple-500/20 rounded-2xl p-5">

                  <p className="text-purple-400 text-xs font-semibold tracking-wider mb-2">
                    WHY THIS LOOP WORKS
                  </p>

                  <p className="text-gray-300 leading-7">
                    The player repeats these connected
                    actions across the game while new
                    levels, challenges, and systems make
                    the experience more interesting.
                  </p>

                </div>

              </div>
            )}

            {/* PLAYER ACTIONS */}

            {activeSection === "actions" && (
              <div className="bg-[#151A2D] border border-gray-800 rounded-3xl p-6 md:p-8">

                <div className="mb-7">

                  <p className="text-purple-400 text-xs font-semibold tracking-[0.25em] mb-2">
                    PLAYER CAPABILITIES
                  </p>

                  <h2 className="text-2xl md:text-3xl font-bold">
                    What the Player Can Do
                  </h2>

                  <p className="text-gray-500 mt-2">
                    The important actions used throughout
                    this game.
                  </p>

                </div>

                <div className="grid md:grid-cols-2 gap-4">

                  {playerActions.map(
                    (action, index) => (
                      <div
                        key={`${action.action}-${index}`}
                        className="group bg-[#0F172A] border border-gray-800 hover:border-purple-500/50 rounded-2xl p-5 transition"
                      >

                        <div className="flex items-start gap-4">

                          <div className="w-11 h-11 shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </div>

                          <div>

                            <h3 className="text-lg font-bold mb-2">
                              {action.action}
                            </h3>

                            <p className="text-gray-400 leading-7">
                              {action.description}
                            </p>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* GAMEPLAY SYSTEMS */}

            {activeSection === "systems" && (
              <div className="space-y-4">

                <div className="bg-[#151A2D] border border-gray-800 rounded-3xl p-6 md:p-8">

                  <div className="mb-7">

                    <p className="text-purple-400 text-xs font-semibold tracking-[0.25em] mb-2">
                      GAME-SPECIFIC DESIGN
                    </p>

                    <h2 className="text-2xl md:text-3xl font-bold">
                      Core Gameplay Systems
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Only the systems that belong to this
                      game and support its playable journey.
                    </p>

                  </div>

                  <div className="space-y-4">

                    {gameplaySystems.map(
                      (system, index) => (
                        <div
                          key={`${system.system_name}-${index}`}
                          className="bg-[#0F172A] border border-gray-800 rounded-2xl overflow-hidden"
                        >

                          <div className="p-5 md:p-6 border-b border-gray-800">

                            <div className="flex items-start gap-4">

                              <div className="w-12 h-12 shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                                {String(index + 1).padStart(
                                  2,
                                  "0"
                                )}
                              </div>

                              <div>

                                <h3 className="text-xl font-bold mb-2">
                                  {system.system_name}
                                </h3>

                                <p className="text-gray-400 leading-7">
                                  {system.description}
                                </p>

                              </div>

                            </div>

                          </div>

                          <div className="grid md:grid-cols-2">

                            <div className="p-5 md:p-6 border-b md:border-b-0 md:border-r border-gray-800">

                              <p className="text-purple-400 text-xs font-semibold tracking-wider mb-3">
                                ⚙️ HOW IT WORKS
                              </p>

                              <p className="text-gray-300 leading-7">
                                {system.how_it_works}
                              </p>

                            </div>

                            <div className="p-5 md:p-6">

                              <p className="text-purple-400 text-xs font-semibold tracking-wider mb-3">
                                ✨ WHY IT MATTERS
                              </p>

                              <p className="text-gray-300 leading-7">
                                {system.why_it_matters}
                              </p>

                            </div>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </div>

              </div>
            )}

            {/* PROGRESSION */}

            {activeSection === "progression" && (
              <div className="bg-[#151A2D] border border-gray-800 rounded-3xl p-6 md:p-8">

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 mb-7">

                  <div>

                    <p className="text-purple-400 text-xs font-semibold tracking-[0.25em] mb-2">
                      PLAYER GROWTH
                    </p>

                    <h2 className="text-2xl md:text-3xl font-bold">
                      Progression System
                    </h2>

                  </div>

                  <span className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm">
                    {progression.progression_type}
                  </span>

                </div>

                <div className="bg-[#0F172A] border border-purple-500/20 rounded-2xl p-5 mb-5">

                  <p className="text-purple-400 text-xs font-semibold tracking-wider mb-3">
                    📈 HOW THE PLAYER PROGRESSES
                  </p>

                  <p className="text-gray-200 leading-7">
                    {progression.how_player_progresses}
                  </p>

                </div>

                <div>

                  <p className="text-purple-400 text-xs font-semibold tracking-wider mb-4">
                    🔓 UNLOCKABLES
                  </p>

                  <div className="grid md:grid-cols-2 gap-3">

                    {progression.unlockables?.map(
                      (unlockable, index) => (
                        <div
                          key={`${unlockable}-${index}`}
                          className="flex items-start gap-3 bg-[#0F172A] border border-gray-800 rounded-xl p-4"
                        >

                          <div className="w-8 h-8 shrink-0 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                            ✓
                          </div>

                          <p className="text-gray-300 leading-6">
                            {unlockable}
                          </p>

                        </div>
                      )
                    )}

                  </div>

                </div>

              </div>
            )}

            {/* REWARDS */}

            {activeSection === "rewards" && (
              <div className="bg-[#151A2D] border border-gray-800 rounded-3xl p-6 md:p-8">

                <div className="mb-7">

                  <p className="text-purple-400 text-xs font-semibold tracking-[0.25em] mb-2">
                    PLAYER MOTIVATION
                  </p>

                  <h2 className="text-2xl md:text-3xl font-bold">
                    Rewards System
                  </h2>

                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">

                  {rewards.main_rewards?.map(
                    (reward, index) => (
                      <div
                        key={`${reward}-${index}`}
                        className="bg-[#0F172A] border border-gray-800 rounded-2xl p-5"
                      >

                        <div className="w-11 h-11 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-xl mb-4">
                          🏆
                        </div>

                        <p className="text-gray-200 leading-7">
                          {reward}
                        </p>

                      </div>
                    )
                  )}

                </div>

                <div className="bg-purple-950/20 border border-purple-500/20 rounded-2xl p-5">

                  <p className="text-purple-400 text-xs font-semibold tracking-wider mb-3">
                    ✨ HOW REWARDS ARE EARNED
                  </p>

                  <p className="text-gray-300 leading-7">
                    {rewards.how_rewards_are_earned}
                  </p>

                </div>

              </div>
            )}

            {/* FAILURE CONDITIONS */}

            {activeSection === "failure" && (
              <div className="bg-[#151A2D] border border-gray-800 rounded-3xl p-6 md:p-8">

                <div className="mb-7">

                  <p className="text-purple-400 text-xs font-semibold tracking-[0.25em] mb-2">
                    RISK AND CONSEQUENCE
                  </p>

                  <h2 className="text-2xl md:text-3xl font-bold">
                    Failure Conditions
                  </h2>

                  <p className="text-gray-500 mt-2">
                    What can go wrong and what happens
                    after the player fails.
                  </p>

                </div>

                <div className="space-y-4">

                  {failureConditions.map(
                    (failure, index) => (
                      <div
                        key={`${failure.condition}-${index}`}
                        className="grid md:grid-cols-[1fr_1.2fr] bg-[#0F172A] border border-gray-800 rounded-2xl overflow-hidden"
                      >

                        <div className="p-5 border-b md:border-b-0 md:border-r border-gray-800">

                          <div className="flex items-start gap-3">

                            <div className="w-9 h-9 shrink-0 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                              ⚠️
                            </div>

                            <div>

                              <p className="text-red-300 text-xs font-semibold tracking-wider mb-2">
                                FAILURE CONDITION
                              </p>

                              <p className="text-gray-200 leading-7">
                                {failure.condition}
                              </p>

                            </div>

                          </div>

                        </div>

                        <div className="p-5">

                          <p className="text-purple-400 text-xs font-semibold tracking-wider mb-2">
                            WHAT HAPPENS
                          </p>

                          <p className="text-gray-400 leading-7">
                            {failure.result}
                          </p>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* CONTROLS */}

            {activeSection === "controls" && (
              <div className="bg-[#151A2D] border border-gray-800 rounded-3xl p-6 md:p-8">

                <div className="mb-7">

                  <p className="text-purple-400 text-xs font-semibold tracking-[0.25em] mb-2">
                    PLAYER INTERACTION
                  </p>

                  <h2 className="text-2xl md:text-3xl font-bold">
                    Controls and Interactions
                  </h2>

                  <p className="text-gray-500 mt-2">
                    The important ways the player interacts
                    with this game.
                  </p>

                </div>

                <div className="space-y-3">

                  {controls.map(
                    (control, index) => (
                      <div
                        key={`${control.interaction}-${index}`}
                        className="grid md:grid-cols-[1fr_180px_1.3fr] items-center gap-4 bg-[#0F172A] border border-gray-800 rounded-2xl p-5"
                      >

                        <div>

                          <p className="text-purple-400 text-xs font-semibold tracking-wider mb-2">
                            INTERACTION
                          </p>

                          <p className="text-gray-200 font-semibold">
                            {control.interaction}
                          </p>

                        </div>

                        <div>

                          <p className="text-purple-400 text-xs font-semibold tracking-wider mb-2">
                            PLAYER INPUT
                          </p>

                          <span className="inline-flex px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-semibold">
                            {control.player_input}
                          </span>

                        </div>

                        <div>

                          <p className="text-purple-400 text-xs font-semibold tracking-wider mb-2">
                            RESULT
                          </p>

                          <p className="text-gray-400 leading-6">
                            {control.result}
                          </p>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          </motion.div>

        </AnimatePresence>

        {/* BOTTOM STATUS */}

        <div className="mt-6 bg-[#151A2D] border border-purple-500/20 rounded-3xl p-6">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

            <div>

              <p className="text-purple-400 text-xs font-semibold tracking-[0.25em] mb-2">
                GAMEPLAY DESIGN COMPLETE
              </p>

              <h2 className="text-xl md:text-2xl font-bold mb-2">
                Your game now has a playable foundation
              </h2>

              <p className="text-gray-400">
                The player actions, systems, progression,
                rewards, and interactions are now connected.
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/visual-style", {
                  state: {
                    gamePlan: gamePlan,
                    story: story,
                    characters: characters,
                    levels: levels,
                    gameplay: gameplay,
                  },
                })
              }
              className="shrink-0 px-6 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold transition shadow-lg shadow-purple-700/30"
            >
              Continue to Visual Style →
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Gameplay;