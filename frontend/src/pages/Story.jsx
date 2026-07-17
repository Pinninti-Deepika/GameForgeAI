import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Story() {
  const location = useLocation();
  const navigate = useNavigate();

  const savedGamePlan = sessionStorage.getItem("gamePlan");
  const savedStory = sessionStorage.getItem("story");

  const gamePlan =
    location.state?.gamePlan ||
    (savedGamePlan ? JSON.parse(savedGamePlan) : null);

  const [story, setStory] = useState(
    savedStory ? JSON.parse(savedStory) : null
  );

  const [loading, setLoading] = useState(!savedStory);
  const [activeStep, setActiveStep] = useState(0);
  const [activeStorySection, setActiveStorySection] = useState(0);

  const loadingSteps = [
    {
      icon: "🧠",
      text: "Reading your game plan...",
    },
    {
      icon: "🌍",
      text: "Building the game world...",
    },
    {
      icon: "⚔️",
      text: "Creating the main conflict...",
    },
    {
      icon: "🔥",
      text: "Shaping the climax...",
    },
    {
      icon: "⚡",
      text: "Preparing the final twist...",
    },
  ];

  const storySections = story
    ? [
        {
          key: "beginning",
          number: "01",
          title: "Beginning",
          icon: "🌅",
          content: story.beginning,
        },
        {
          key: "rising_action",
          number: "02",
          title: "Rising Action",
          icon: "📈",
          content: story.rising_action,
        },
        {
          key: "midpoint",
          number: "03",
          title: "Midpoint",
          icon: "🔀",
          content: story.midpoint,
        },
        {
          key: "climax",
          number: "04",
          title: "Climax",
          icon: "🔥",
          content: story.climax,
        },
        {
          key: "ending",
          number: "05",
          title: "Ending",
          icon: "🌙",
          content: story.ending,
        },
        {
          key: "plot_twist",
          number: "06",
          title: "Plot Twist",
          icon: "⚡",
          content: story.plot_twist,
        },
      ]
    : [];

  useEffect(() => {
    if (!gamePlan) {
      navigate("/generate");
      return;
    }

    // If the story already exists, do not call Gemini again.
    if (story) {
      setLoading(false);
      return;
    }

    const generateStory = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/generate-story",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              game_plan: gamePlan,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Story request failed: ${response.status}`
          );
        }

        const data = await response.json();

        if (data.success) {
          setStory(data.story);

          sessionStorage.setItem(
            "story",
            JSON.stringify(data.story)
          );
        } else {
          alert(
            "The Story Agent could not generate the story."
          );

          navigate("/generate");
        }
      } catch (error) {
        console.error(
          "Story generation error:",
          error
        );

        alert(
          "Could not connect to the Story Agent. Make sure the backend is running."
        );

        navigate("/generate");
      } finally {
        setLoading(false);
      }
    };

    generateStory();
  }, [gamePlan, story, navigate]);

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

  const activeSection = storySections[activeStorySection];

  const goToPreviousSection = () => {
    if (activeStorySection > 0) {
      setActiveStorySection(
        activeStorySection - 1
      );
    }
  };

  const goToNextSection = () => {
    if (
      activeStorySection <
      storySections.length - 1
    ) {
      setActiveStorySection(
        activeStorySection + 1
      );
    }
  };

  const continueToCharacters = () => {
    navigate("/characters", {
      state: {
        gamePlan: gamePlan,
        story: story,
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
          className="absolute top-20 left-20 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full"
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
              📖
            </motion.div>

          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-purple-400 text-sm font-semibold tracking-[0.3em] mb-4"
          >
            STORY AGENT ACTIVE
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
            Your world is taking shape...
          </motion.h1>

          <p className="text-gray-400 mb-10">
            The Story Agent is turning your game plan into a complete story.
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

  if (!story || !activeSection) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-6 py-8">

      <div className="max-w-7xl mx-auto">

        {/* TOP BAR */}

        <div className="flex items-center justify-between mb-10">

          <button
            onClick={() =>
              navigate("/generate")
            }
            className="text-gray-400 hover:text-white transition"
          >
            ← Back to Planner
          </button>

          <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            ✓ Story Agent Complete
          </div>

        </div>

        {/* STORY HEADER */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center mb-10"
        >

          <p className="text-purple-400 text-sm font-semibold tracking-[0.3em] mb-3">
            STORY STUDIO
          </p>

          <h1 className="text-5xl font-bold mb-3">
            {gamePlan.title}
          </h1>

          <p className="text-gray-400">
            Explore your story one important moment at a time.
          </p>

        </motion.div>

        {/* STORY TABS */}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">

          {storySections.map((section, index) => (
            <button
              key={section.key}
              onClick={() =>
                setActiveStorySection(index)
              }
              className={
                activeStorySection === index
                  ? "p-4 rounded-2xl bg-purple-600 border border-purple-400 transition"
                  : "p-4 rounded-2xl bg-[#151A2D] border border-gray-800 hover:border-purple-500 transition"
              }
            >
              <span className="block text-2xl mb-2">
                {section.icon}
              </span>

              <span className="text-sm font-semibold">
                {section.title}
              </span>
            </button>
          ))}

        </div>

        {/* ACTIVE STORY CARD */}

        <AnimatePresence mode="wait">

          <motion.div
            key={activeSection.key}
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -30,
            }}
            transition={{
              duration: 0.3,
            }}
            className={
              activeSection.key === "plot_twist"
                ? "bg-purple-950/20 border border-purple-500/50 rounded-3xl p-8 md:p-10"
                : "bg-[#151A2D] border border-gray-800 rounded-3xl p-8 md:p-10"
            }
          >

            <div className="flex items-start justify-between gap-6 mb-6">

              <div>

                <p className="text-purple-400 text-sm font-semibold tracking-widest mb-2">
                  STORY BEAT {activeSection.number}
                </p>

                <h2 className="text-3xl font-bold">
                  {activeSection.icon}{" "}
                  {activeSection.title}
                </h2>

              </div>

              <span className="text-7xl font-black text-white/5">
                {activeSection.number}
              </span>

            </div>

            <p className="text-gray-300 leading-8 text-lg max-w-5xl">
              {activeSection.content}
            </p>

          </motion.div>

        </AnimatePresence>

        {/* STORY NAVIGATION */}

        <div className="flex items-center justify-between mt-6">

          <button
            onClick={goToPreviousSection}
            disabled={activeStorySection === 0}
            className="px-6 py-3 rounded-xl bg-[#151A2D] border border-gray-800 hover:border-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            ← Previous
          </button>

          <p className="text-gray-500 text-sm">
            {activeStorySection + 1} of{" "}
            {storySections.length}
          </p>

          <button
            onClick={goToNextSection}
            disabled={
              activeStorySection ===
              storySections.length - 1
            }
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Next Story Beat →
          </button>

        </div>

        {/* CONTINUE TO CHARACTER AGENT */}

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
                Meet the Characters Behind Your Story
              </h2>

              <p className="text-gray-400">
                Let the Character Agent create your hero, antagonist, and supporting cast.
              </p>

            </div>

            <button
              onClick={continueToCharacters}
              className="shrink-0 px-7 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold transition shadow-lg shadow-purple-700/30"
            >
              Continue to Characters →
            </button>

          </div>

        </motion.div>

      </div>
    </div>
  );
}

export default Story;