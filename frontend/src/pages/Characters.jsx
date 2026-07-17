import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Keeps the same request if React remounts the component in development.
let characterRequestPromise = null;

function Characters() {
  const location = useLocation();
  const navigate = useNavigate();

  // Load these values only once.
  const [gamePlan] = useState(() => {
    if (location.state?.gamePlan) {
      return location.state.gamePlan;
    }

    const savedGamePlan = sessionStorage.getItem("gamePlan");

    return savedGamePlan
      ? JSON.parse(savedGamePlan)
      : null;
  });

  const [story] = useState(() => {
    if (location.state?.story) {
      return location.state.story;
    }

    const savedStory = sessionStorage.getItem("story");

    return savedStory
      ? JSON.parse(savedStory)
      : null;
  });

  const [characters, setCharacters] = useState(() => {
    const savedCharacters =
      sessionStorage.getItem("characters");

    return savedCharacters
      ? JSON.parse(savedCharacters)
      : null;
  });

  const [loading, setLoading] = useState(
    () => !sessionStorage.getItem("characters")
  );

  const [activeStep, setActiveStep] = useState(0);
  const [activeCharacterIndex, setActiveCharacterIndex] =
    useState(0);

  // Stops the effect from starting generation twice.
  const hasStartedGeneration = useRef(false);

  const loadingSteps = [
    {
      icon: "🧠",
      text: "Reading the complete story...",
    },
    {
      icon: "👤",
      text: "Finding the main hero...",
    },
    {
      icon: "😈",
      text: "Shaping the main antagonist...",
    },
    {
      icon: "🤝",
      text: "Building the supporting cast...",
    },
    {
      icon: "✨",
      text: "Connecting every character to the story...",
    },
  ];

  useEffect(() => {
    if (!gamePlan || !story) {
      navigate("/generate");
      return;
    }

    // Characters already exist.
    // Do not call the backend again.
    if (characters) {
      setLoading(false);
      return;
    }

    // This component already started generation.
    if (hasStartedGeneration.current) {
      return;
    }

    hasStartedGeneration.current = true;

    const generateCharacters = async () => {
      setLoading(true);

      try {
        // If there is no request running, create one.
        if (!characterRequestPromise) {
          characterRequestPromise = fetch(
           `${import.meta.env.VITE_API_URL}/generate-characters`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                game_plan: gamePlan,
                story: story,
              }),
            }
          )
            .then(async (response) => {
              if (!response.ok) {
                throw new Error(
                  `Character request failed: ${response.status}`
                );
              }

              return response.json();
            })
            .finally(() => {
              characterRequestPromise = null;
            });
        }

        // Reuse the existing request if one is already running.
        const data = await characterRequestPromise;

        if (data.success) {
          sessionStorage.setItem(
            "characters",
            JSON.stringify(data.characters)
          );

          setCharacters(data.characters);
        } else {
          alert(
            "The Character Agent could not create the characters."
          );

          navigate("/story", {
            state: {
              gamePlan: gamePlan,
            },
          });
        }
      } catch (error) {
        console.error(
          "Character generation error:",
          error
        );

        alert(
          "Could not connect to the Character Agent. Make sure the backend is running."
        );

        navigate("/story", {
          state: {
            gamePlan: gamePlan,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    generateCharacters();
  }, [gamePlan, story, characters, navigate]);

  useEffect(() => {
    if (!loading) {
      return;
    }

    const interval = setInterval(() => {
      setActiveStep((currentStep) => {
        if (currentStep < loadingSteps.length - 1) {
          return currentStep + 1;
        }

        return currentStep;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [loading, loadingSteps.length]);

  // Continue to the Level Agent.
  const continueToLevels = () => {
    navigate("/levels", {
      state: {
        gamePlan: gamePlan,
        story: story,
        characters: characters,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B14] text-white flex items-center justify-center px-6 overflow-hidden relative">

        {/* BACKGROUND GLOWS */}

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
              👥
            </motion.div>

          </div>

          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="text-purple-400 text-sm font-semibold tracking-[0.3em] mb-4"
          >
            CHARACTER AGENT ACTIVE
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
            Your cast is coming to life...
          </motion.h1>

          <p className="text-gray-400 mb-10">
            The Character Agent is finding the people who belong in your story.
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

          {/* PROGRESS STEPS */}

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

  if (!characters) {
    return null;
  }

  const allCharacters = [
    {
      ...characters.main_character,
      characterType: "Main Character",
      icon: "🦸",
      type: "main",
    },
    {
      ...characters.main_antagonist,
      characterType: "Main Antagonist",
      icon: "😈",
      type: "main",
    },
    ...(characters.supporting_characters || []).map(
      (character) => ({
        ...character,
        characterType: "Supporting Character",
        icon: "👤",
        type: "supporting",
      })
    ),
  ];

  const selectedCharacter =
    allCharacters[activeCharacterIndex];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-6 py-8">

      <div className="max-w-7xl mx-auto">

        {/* TOP BAR */}

        <div className="flex items-center justify-between mb-8">

          <button
            onClick={() =>
              navigate("/story", {
                state: {
                  gamePlan: gamePlan,
                },
              })
            }
            className="text-gray-400 hover:text-white transition"
          >
            ← Back to Story
          </button>

          <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            ✓ Character Agent Complete
          </div>

        </div>

        {/* HEADER */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center mb-8"
        >

          <p className="text-purple-400 text-sm font-semibold tracking-[0.3em] mb-3">
            CHARACTER STUDIO
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Meet the Cast
          </h1>

          <p className="text-gray-400">
            Explore the characters shaping the world of{" "}
            <span className="text-gray-200">
              {gamePlan.title}
            </span>
            .
          </p>

        </motion.div>

        {/* CHARACTER SELECTOR */}

        <div className="mb-6">

          <p className="text-xs text-gray-500 tracking-[0.2em] mb-3">
            SELECT A CHARACTER
          </p>

          <div className="flex gap-3 overflow-x-auto pb-3">

            {allCharacters.map((character, index) => (

              <button
                key={`${character.name}-${index}`}
                onClick={() =>
                  setActiveCharacterIndex(index)
                }
                className={
                  activeCharacterIndex === index
                    ? "min-w-[190px] flex-1 p-4 rounded-2xl bg-purple-600 border border-purple-400 text-left transition"
                    : "min-w-[190px] flex-1 p-4 rounded-2xl bg-[#151A2D] border border-gray-800 hover:border-purple-500 text-left transition"
                }
              >

                <div className="flex items-center gap-3">

                  <div
                    className={
                      activeCharacterIndex === index
                        ? "w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-2xl"
                        : "w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl"
                    }
                  >
                    {character.icon}
                  </div>

                  <div className="min-w-0">

                    <p className="font-bold truncate">
                      {character.name}
                    </p>

                    <p
                      className={
                        activeCharacterIndex === index
                          ? "text-xs text-purple-100 mt-1"
                          : "text-xs text-gray-500 mt-1"
                      }
                    >
                      {character.characterType}
                    </p>

                  </div>

                </div>

              </button>

            ))}

          </div>

        </div>

        {/* SELECTED CHARACTER PANEL */}

        <AnimatePresence mode="wait">

          <motion.div
            key={activeCharacterIndex}
            initial={{
              opacity: 0,
              x: 25,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -25,
            }}
            transition={{
              duration: 0.25,
            }}
            className="bg-[#151A2D] border border-gray-800 rounded-3xl overflow-hidden"
          >

            {/* CHARACTER HERO SECTION */}

            <div className="relative p-7 md:p-9 border-b border-gray-800 overflow-hidden">

              <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/10 blur-[90px] rounded-full" />

              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">

                <div className="flex items-center gap-5">

                  <div className="w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center text-4xl">
                    {selectedCharacter.icon}
                  </div>

                  <div>

                    <p className="text-purple-400 text-xs font-semibold tracking-[0.25em] mb-2">
                      {selectedCharacter.characterType.toUpperCase()}
                    </p>

                    <h2 className="text-3xl md:text-4xl font-bold">
                      {selectedCharacter.name}
                    </h2>

                    <p className="text-gray-400 mt-2">
                      {selectedCharacter.role}
                    </p>

                  </div>

                </div>

                <div className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm">
                  {selectedCharacter.personality}
                </div>

              </div>

            </div>

            {/* MAIN CHARACTER DETAILS */}

            {selectedCharacter.type === "main" && (

              <div className="p-6 md:p-8">

                <div className="grid md:grid-cols-2 gap-4">

                  {/* GOAL */}

                  <div className="bg-[#0F172A] rounded-2xl p-5 border border-gray-800">

                    <p className="text-purple-400 text-xs font-semibold tracking-widest mb-3">
                      🎯 GOAL
                    </p>

                    <p className="text-gray-300 leading-7">
                      {selectedCharacter.goal}
                    </p>

                  </div>

                  {/* WEAKNESS */}

                  <div className="bg-[#0F172A] rounded-2xl p-5 border border-gray-800">

                    <p className="text-purple-400 text-xs font-semibold tracking-widest mb-3">
                      ⚠️ WEAKNESS
                    </p>

                    <p className="text-gray-300 leading-7">
                      {selectedCharacter.weakness}
                    </p>

                  </div>

                  {/* BACKGROUND */}

                  <div className="md:col-span-2 bg-[#0F172A] rounded-2xl p-5 border border-gray-800">

                    <p className="text-purple-400 text-xs font-semibold tracking-widest mb-3">
                      📖 BACKGROUND
                    </p>

                    <p className="text-gray-300 leading-7">
                      {selectedCharacter.background}
                    </p>

                  </div>

                  {/* STRENGTHS */}

                  <div className="bg-[#0F172A] rounded-2xl p-5 border border-gray-800">

                    <p className="text-purple-400 text-xs font-semibold tracking-widest mb-4">
                      💪 STRENGTHS
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {(selectedCharacter.strengths || []).map(
                        (strength, index) => (
                          <span
                            key={index}
                            className="px-3 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm"
                          >
                            {strength}
                          </span>
                        )
                      )}

                    </div>

                  </div>

                  {/* ABILITIES */}

                  <div className="bg-[#0F172A] rounded-2xl p-5 border border-gray-800">

                    <p className="text-purple-400 text-xs font-semibold tracking-widest mb-4">
                      ⚡ ABILITIES
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {(selectedCharacter.abilities || []).length > 0 ? (

                        selectedCharacter.abilities.map(
                          (ability, index) => (
                            <span
                              key={index}
                              className="px-3 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm"
                            >
                              {ability}
                            </span>
                          )
                        )

                      ) : (

                        <p className="text-gray-500 text-sm">
                          No special abilities
                        </p>

                      )}

                    </div>

                  </div>

                </div>

              </div>

            )}

            {/* SUPPORTING CHARACTER DETAILS */}

            {selectedCharacter.type === "supporting" && (

              <div className="p-6 md:p-8">

                <div className="grid md:grid-cols-2 gap-4">

                  {/* GOAL */}

                  <div className="bg-[#0F172A] rounded-2xl p-5 border border-gray-800">

                    <p className="text-purple-400 text-xs font-semibold tracking-widest mb-3">
                      🎯 GOAL
                    </p>

                    <p className="text-gray-300 leading-7">
                      {selectedCharacter.goal}
                    </p>

                  </div>

                  {/* PERSONALITY */}

                  <div className="bg-[#0F172A] rounded-2xl p-5 border border-gray-800">

                    <p className="text-purple-400 text-xs font-semibold tracking-widest mb-3">
                      🧠 PERSONALITY
                    </p>

                    <p className="text-gray-300 leading-7">
                      {selectedCharacter.personality}
                    </p>

                  </div>

                  {/* STORY CONNECTION */}

                  <div className="md:col-span-2 bg-[#0F172A] rounded-2xl p-5 border border-purple-500/20">

                    <p className="text-purple-400 text-xs font-semibold tracking-widest mb-3">
                      🔗 CONNECTION TO STORY
                    </p>

                    <p className="text-gray-300 leading-7">
                      {selectedCharacter.connection_to_story}
                    </p>

                  </div>

                </div>

              </div>

            )}

          </motion.div>

        </AnimatePresence>

        {/* CHARACTER COUNT */}

        <div className="flex items-center justify-center mt-5">

          <p className="text-gray-500 text-sm">
            Character {activeCharacterIndex + 1} of{" "}
            {allCharacters.length}
          </p>

        </div>

        {/* CONTINUE TO LEVEL AGENT */}

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
          className="mt-10 bg-[#151A2D] border border-purple-500/30 rounded-3xl p-6 md:p-8"
        >

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div>

              <p className="text-purple-400 text-xs font-semibold tracking-[0.3em] mb-2">
                NEXT DESIGN STAGE
              </p>

              <h2 className="text-2xl font-bold mb-2">
                Turn Your Story Into Playable Levels
              </h2>

              <p className="text-gray-400">
                Let the Level Agent create objectives, challenges, locations, and the complete game journey.
              </p>

            </div>

            <button
              onClick={continueToLevels}
              className="shrink-0 px-7 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold transition shadow-lg shadow-purple-700/30"
            >
              Continue to Level Design →
            </button>

          </div>

        </motion.div>

      </div>
    </div>
  );
}

export default Characters;
