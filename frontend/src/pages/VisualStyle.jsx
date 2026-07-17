import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

let visualStyleRequestPromise = null;

function VisualStyle() {
  const location = useLocation();
  const navigate = useNavigate();

  const getSavedData = (stateKey, storageKey) => {
    if (location.state?.[stateKey]) {
      return location.state[stateKey];
    }

    const savedData = sessionStorage.getItem(storageKey);

    return savedData
      ? JSON.parse(savedData)
      : null;
  };

  const [gamePlan] = useState(() =>
    getSavedData("gamePlan", "gamePlan")
  );

  const [story] = useState(() =>
    getSavedData("story", "story")
  );

  const [characters] = useState(() =>
    getSavedData("characters", "characters")
  );

  const [levels] = useState(() =>
    getSavedData("levels", "levels")
  );

  const [gameplay] = useState(() =>
    getSavedData("gameplay", "gameplay")
  );

  const [visualStyle, setVisualStyle] = useState(() => {
    const savedVisualStyle =
      sessionStorage.getItem("visualStyle");

    return savedVisualStyle
      ? JSON.parse(savedVisualStyle)
      : null;
  });

  const [loading, setLoading] = useState(
    () => !sessionStorage.getItem("visualStyle")
  );

  const [activeStep, setActiveStep] = useState(0);

  const [activeSection, setActiveSection] =
    useState("overview");

  const [activeCharacterIndex, setActiveCharacterIndex] =
    useState(0);

  const hasStartedGeneration = useRef(false);

  const loadingSteps = [
    {
      icon: "🎨",
      text: "Studying the game world.",
    },
    {
      icon: "🌈",
      text: "Choosing the visual identity.",
    },
    {
      icon: "🌍",
      text: "Designing environments.",
    },
    {
      icon: "👤",
      text: "Shaping character visuals.",
    },
    {
      icon: "✨",
      text: "Creating effects and presentation.",
    },
  ];

  useEffect(() => {
    if (
      !gamePlan ||
      !story ||
      !characters ||
      !levels ||
      !gameplay
    ) {
      navigate("/generate");
      return;
    }

    if (visualStyle) {
      setLoading(false);
      return;
    }

    if (hasStartedGeneration.current) {
      return;
    }

    hasStartedGeneration.current = true;

    const generateVisualStyle = async () => {
      setLoading(true);

      try {
        if (!visualStyleRequestPromise) {
          visualStyleRequestPromise = fetch(
            "http://127.0.0.1:8000/generate-visual-style",
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
                gameplay: gameplay,
              }),
            }
          )
            .then(async (response) => {
              if (!response.ok) {
                throw new Error(
                  `Visual Style request failed: ${response.status}`
                );
              }

              return response.json();
            })
            .finally(() => {
              visualStyleRequestPromise = null;
            });
        }

        const data = await visualStyleRequestPromise;

        if (data.success) {
          sessionStorage.setItem(
            "visualStyle",
            JSON.stringify(data.visual_style)
          );

          setVisualStyle(data.visual_style);
        } else {
          alert(
            "The Visual Style Agent could not generate the visual design."
          );

          navigate("/gameplay");
        }
      } catch (error) {
        console.error(
          "Visual Style generation error:",
          error
        );

        alert(
          "Could not connect to the Visual Style Agent. Make sure the backend is running."
        );

        navigate("/gameplay");
      } finally {
        setLoading(false);
      }
    };

    generateVisualStyle();
  }, [
    gamePlan,
    story,
    characters,
    levels,
    gameplay,
    visualStyle,
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

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
          className="absolute w-[500px] h-[500px] bg-pink-700/20 blur-[120px] rounded-full"
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
          className="absolute top-20 left-20 w-72 h-72 bg-purple-600/10 blur-[100px] rounded-full"
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
              className="absolute inset-0 rounded-full border border-pink-500/40 border-t-pink-400"
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
              className="absolute inset-4 rounded-full border border-purple-500/30 border-b-purple-400"
            />

            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                boxShadow: [
                  "0 0 20px rgba(236, 72, 153, 0.3)",
                  "0 0 60px rgba(236, 72, 153, 0.8)",
                  "0 0 20px rgba(236, 72, 153, 0.3)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-4xl"
            >
              🎨
            </motion.div>

          </div>

          <p className="text-pink-400 text-sm font-semibold tracking-[0.3em] mb-4">
            VISUAL STYLE AGENT ACTIVE
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your game is finding its look.
          </h1>

          <p className="text-gray-400 mb-10">
            The Visual Style Agent is building a complete visual identity for your game.
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

          <div className="flex justify-center gap-3 mt-6">

            {loadingSteps.map((step, index) => (
              <motion.div
                key={step.text}
                animate={{
                  width:
                    index === activeStep ? 32 : 8,
                  backgroundColor:
                    index <= activeStep
                      ? "#ec4899"
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

  if (!visualStyle) {
    return null;
  }

  const {
    visual_overview = {},
    color_direction = {},
    lighting_and_atmosphere = {},
    environment_design = {},
    character_visual_direction = [],
    enemy_and_creature_design = {},
    visual_effects = [],
    camera_and_presentation = {},
    ui_and_hud_style = {},
  } = visualStyle;

  const activeCharacter =
    character_visual_direction[activeCharacterIndex];

  const sections = [
    {
      id: "overview",
      icon: "🎨",
      label: "Overview",
    },
    {
      id: "world",
      icon: "🌍",
      label: "World",
    },
    {
      id: "characters",
      icon: "👤",
      label: "Characters",
    },
    {
      id: "effects",
      icon: "✨",
      label: "Effects",
    },
    {
      id: "camera",
      icon: "🎥",
      label: "Camera",
    },
    {
      id: "ui",
      icon: "🖥️",
      label: "UI & HUD",
    },
  ];

  return (
    <div className="min-h-screen bg-[#090D17] text-white px-5 md:px-8 py-6">

      <div className="max-w-7xl mx-auto">

        {/* TOP BAR */}

        <div className="flex items-center justify-between mb-6">

          <button
            onClick={() => navigate("/gameplay")}
            className="text-gray-400 hover:text-white transition"
          >
            ← Back to Gameplay
          </button>

          <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            ✓ Visual Style Complete
          </div>

        </div>

        {/* COMPACT HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-6">

          <div>

            <p className="text-pink-400 text-xs font-semibold tracking-[0.3em] mb-2">
              VISUAL DESIGN STUDIO
            </p>

            <h1 className="text-3xl md:text-4xl font-bold">
              {gamePlan.title}
            </h1>

          </div>

          <p className="text-gray-500 max-w-xl lg:text-right">
            The complete art direction, world look,
            characters, effects and presentation of your game.
          </p>

        </div>

        {/* NAVIGATION */}

        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-2 mb-5 overflow-x-auto">

          <div className="flex gap-2 min-w-max">

            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() =>
                  setActiveSection(section.id)
                }
                className={
                  activeSection === section.id
                    ? "px-5 py-3 rounded-xl bg-pink-600 text-white font-semibold transition"
                    : "px-5 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition"
                }
              >
                <span className="mr-2">
                  {section.icon}
                </span>

                {section.label}
              </button>
            ))}

          </div>

        </div>

        <AnimatePresence mode="wait">

          <motion.div
            key={activeSection}
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            transition={{
              duration: 0.22,
            }}
          >

            {/* OVERVIEW */}

            {activeSection === "overview" && (
              <div className="space-y-4">

                <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-4">

                  <div className="relative bg-[#151A2D] border border-pink-500/20 rounded-3xl p-6 overflow-hidden">

                    <div className="absolute right-0 top-0 w-72 h-72 bg-pink-600/10 blur-[100px] rounded-full" />

                    <div className="relative">

                      <p className="text-xs text-pink-400 font-semibold tracking-[0.25em] mb-3">
                        ART STYLE
                      </p>

                      <p className="text-lg md:text-xl font-semibold leading-8 mb-5 text-gray-100">
                        {visual_overview.art_style}
                      </p>

                      <div className="h-px bg-gray-800 mb-5" />

                      <p className="text-xs text-gray-500 font-semibold tracking-wider mb-2">
                        VISUAL IDENTITY
                      </p>

                      <p className="text-gray-300 leading-7">
                        {visual_overview.visual_identity}
                      </p>

                    </div>

                  </div>

                  <div className="bg-[#151A2D] border border-gray-800 rounded-3xl p-6">

                    <div className="w-11 h-11 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-xl mb-5">
                      👁️
                    </div>

                    <p className="text-xs text-pink-400 font-semibold tracking-wider mb-3">
                      PLAYER VISUAL EXPERIENCE
                    </p>

                    <p className="text-gray-300 leading-7">
                      {visual_overview.player_visual_experience}
                    </p>

                  </div>

                </div>

                {/* COLORS */}

                <div className="bg-[#151A2D] border border-gray-800 rounded-3xl p-6">

                  <div className="flex flex-col lg:flex-row lg:items-start gap-7">

                    <div className="lg:w-64 shrink-0">

                      <p className="text-xs text-pink-400 font-semibold tracking-[0.2em] mb-2">
                        COLOR DIRECTION
                      </p>

                      <p className="text-gray-400 text-sm leading-6">
                        The main colour language used across the complete game.
                      </p>

                    </div>

                    <div className="flex-1 space-y-5">

                      <div>

                        <p className="text-xs text-gray-500 mb-3">
                          PRIMARY COLORS
                        </p>

                        <div className="flex flex-wrap gap-2">

                          {color_direction.primary_colors?.map(
                            (color) => (
                              <span
                                key={color}
                                className="px-4 py-2 rounded-xl bg-[#0F172A] border border-gray-700 text-gray-200 text-sm"
                              >
                                {color}
                              </span>
                            )
                          )}

                        </div>

                      </div>

                      <div>

                        <p className="text-xs text-gray-500 mb-3">
                          ACCENT COLORS
                        </p>

                        <div className="flex flex-wrap gap-2">

                          {color_direction.accent_colors?.map(
                            (color) => (
                              <span
                                key={color}
                                className="px-4 py-2 rounded-xl bg-pink-500/10 border border-pink-500/25 text-pink-200 text-sm"
                              >
                                {color}
                              </span>
                            )
                          )}

                        </div>

                      </div>

                      <div className="pt-4 border-t border-gray-800">

                        <p className="text-gray-400 leading-7">
                          {color_direction.color_usage}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* WORLD */}

            {activeSection === "world" && (
              <div className="space-y-4">

                <div className="grid lg:grid-cols-2 gap-4">

                  <div className="bg-[#151A2D] border border-gray-800 rounded-3xl p-6">

                    <p className="text-xs text-pink-400 font-semibold tracking-wider mb-3">
                      WORLD DIRECTION
                    </p>

                    <p className="text-gray-300 leading-7">
                      {environment_design.overall_direction}
                    </p>

                  </div>

                  <div className="bg-[#151A2D] border border-gray-800 rounded-3xl p-6">

                    <p className="text-xs text-pink-400 font-semibold tracking-wider mb-3">
                      LIGHTING & ATMOSPHERE
                    </p>

                    <p className="text-gray-200 leading-7 mb-3">
                      {lighting_and_atmosphere.lighting_style}
                    </p>

                    <p className="text-gray-500 leading-7">
                      {lighting_and_atmosphere.atmosphere}
                    </p>

                  </div>

                </div>

                <div className="grid md:grid-cols-2 gap-4">

                  {environment_design.important_locations?.map(
                    (location, index) => (
                      <div
                        key={`${location.location_name}-${index}`}
                        className="bg-[#151A2D] border border-gray-800 rounded-3xl overflow-hidden"
                      >

                        <div className="p-6 border-b border-gray-800">

                          <div className="flex items-start justify-between gap-4">

                            <div>

                              <p className="text-xs text-pink-400 font-semibold tracking-wider mb-2">
                                LOCATION {String(index + 1).padStart(2, "0")}
                              </p>

                              <h3 className="text-2xl font-bold">
                                {location.location_name}
                              </h3>

                            </div>

                            <span className="text-4xl font-black text-white/5">
                              {String(index + 1).padStart(2, "0")}
                            </span>

                          </div>

                        </div>

                        <div className="p-6">

                          <p className="text-gray-300 leading-7 mb-5">
                            {location.visual_appearance}
                          </p>

                          <div className="bg-[#0F172A] rounded-xl p-4 mb-5">

                            <p className="text-xs text-gray-500 mb-2">
                              MOOD
                            </p>

                            <p className="text-gray-300">
                              {location.mood}
                            </p>

                          </div>

                          <div className="space-y-2">

                            {location.important_visual_details?.map(
                              (detail, detailIndex) => (
                                <div
                                  key={`${detail}-${detailIndex}`}
                                  className="flex items-start gap-3"
                                >
                                  <span className="text-pink-400 mt-1">
                                    ✦
                                  </span>

                                  <p className="text-gray-400 text-sm leading-6">
                                    {detail}
                                  </p>
                                </div>
                              )
                            )}

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>

                {lighting_and_atmosphere
                  .weather_and_environment_effects
                  ?.length > 0 && (
                  <div className="bg-[#151A2D] border border-gray-800 rounded-3xl p-6">

                    <p className="text-xs text-pink-400 font-semibold tracking-wider mb-4">
                      ENVIRONMENT EFFECTS
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {lighting_and_atmosphere
                        .weather_and_environment_effects
                        .map((effect) => (
                          <span
                            key={effect}
                            className="px-4 py-2 rounded-xl bg-[#0F172A] border border-gray-700 text-gray-300 text-sm"
                          >
                            {effect}
                          </span>
                        ))}

                    </div>

                  </div>
                )}

              </div>
            )}

            {/* CHARACTERS */}

            {activeSection === "characters" && (
              <div>

                <div className="flex gap-2 overflow-x-auto pb-3 mb-4">

                  {character_visual_direction.map(
                    (character, index) => (
                      <button
                        key={`${character.character_name}-${index}`}
                        onClick={() =>
                          setActiveCharacterIndex(index)
                        }
                        className={
                          activeCharacterIndex === index
                            ? "px-5 py-3 rounded-xl bg-pink-600 border border-pink-400 font-semibold shrink-0 transition"
                            : "px-5 py-3 rounded-xl bg-[#151A2D] border border-gray-800 text-gray-400 hover:text-white hover:border-pink-500 shrink-0 transition"
                        }
                      >
                        {character.character_name}
                      </button>
                    )
                  )}

                </div>

                {activeCharacter && (
                  <motion.div
                    key={activeCharacter.character_name}
                    initial={{
                      opacity: 0,
                      x: 20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    className="bg-[#151A2D] border border-gray-800 rounded-3xl overflow-hidden"
                  >

                    <div className="relative p-6 md:p-8 border-b border-gray-800 overflow-hidden">

                      <div className="absolute right-0 top-0 w-72 h-72 bg-pink-600/10 blur-[100px] rounded-full" />

                      <div className="relative">

                        <p className="text-xs text-pink-400 font-semibold tracking-[0.25em] mb-3">
                          CHARACTER VISUAL DIRECTION
                        </p>

                        <h2 className="text-3xl md:text-4xl font-bold mb-3">
                          {activeCharacter.character_name}
                        </h2>

                        <p className="text-gray-400 max-w-3xl leading-7">
                          {activeCharacter.visual_role}
                        </p>

                      </div>

                    </div>

                    <div className="p-6 md:p-8">

                      <div className="grid lg:grid-cols-2 gap-4 mb-4">

                        <div className="bg-[#0F172A] border border-gray-800 rounded-2xl p-5">

                          <p className="text-xs text-pink-400 font-semibold tracking-wider mb-3">
                            VISUAL STYLE
                          </p>

                          <p className="text-gray-300 leading-7">
                            {activeCharacter.visual_style}
                          </p>

                        </div>

                        <div className="bg-[#0F172A] border border-gray-800 rounded-2xl p-5">

                          <p className="text-xs text-pink-400 font-semibold tracking-wider mb-3">
                            CLOTHING & GEAR
                          </p>

                          <p className="text-gray-300 leading-7">
                            {activeCharacter.clothing_and_gear}
                          </p>

                        </div>

                      </div>

                      <div>

                        <p className="text-xs text-gray-500 font-semibold tracking-wider mb-3">
                          DISTINCTIVE FEATURES
                        </p>

                        <div className="grid md:grid-cols-2 gap-3">

                          {activeCharacter.distinctive_features?.map(
                            (feature, index) => (
                              <div
                                key={`${feature}-${index}`}
                                className="flex items-start gap-3 bg-[#0F172A] border border-gray-800 rounded-xl p-4"
                              >
                                <div className="w-7 h-7 shrink-0 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 text-xs font-bold">
                                  {String(index + 1).padStart(2, "0")}
                                </div>

                                <p className="text-gray-300 text-sm leading-6">
                                  {feature}
                                </p>
                              </div>
                            )
                          )}

                        </div>

                      </div>

                    </div>

                  </motion.div>
                )}

              </div>
            )}

            {/* EFFECTS */}

            {activeSection === "effects" && (
              <div className="space-y-4">

                <div className="bg-[#151A2D] border border-gray-800 rounded-3xl p-6">

                  <p className="text-xs text-pink-400 font-semibold tracking-wider mb-3">
                    THREAT VISUAL DIRECTION
                  </p>

                  <h2 className="text-xl font-semibold mb-4 leading-8">
                    {enemy_and_creature_design.overall_style}
                  </h2>

                  <p className="text-gray-400 leading-7 mb-5">
                    {enemy_and_creature_design.visual_threat_progression}
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {enemy_and_creature_design.design_rules?.map(
                      (rule) => (
                        <span
                          key={rule}
                          className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm"
                        >
                          {rule}
                        </span>
                      )
                    )}

                  </div>

                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

                  {visual_effects.map((effect, index) => (
                    <div
                      key={`${effect.effect_name}-${index}`}
                      className="bg-[#151A2D] border border-gray-800 rounded-2xl p-5"
                    >

                      <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4">
                        ✨
                      </div>

                      <h3 className="text-lg font-bold mb-3">
                        {effect.effect_name}
                      </h3>

                      <p className="text-gray-400 text-sm leading-6 mb-5">
                        {effect.appearance}
                      </p>

                      <div className="pt-4 border-t border-gray-800">

                        <p className="text-xs text-pink-400 mb-2">
                          USED FOR
                        </p>

                        <p className="text-gray-300 text-sm leading-6">
                          {effect.used_for}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>

              </div>
            )}

            {/* CAMERA */}

            {activeSection === "camera" && (
              <div className="space-y-4">

                <div className="bg-[#151A2D] border border-pink-500/20 rounded-3xl p-6 md:p-8">

                  <p className="text-xs text-pink-400 font-semibold tracking-[0.2em] mb-3">
                    MAIN CAMERA STYLE
                  </p>

                  <p className="text-lg md:text-xl font-semibold leading-8 text-gray-100">
                    {camera_and_presentation.camera_style}
                  </p>

                </div>

                <div className="grid md:grid-cols-3 gap-4">

                  {[
                    {
                      icon: "🌍",
                      title: "EXPLORATION",
                      text:
                        camera_and_presentation
                          .exploration_presentation,
                    },
                    {
                      icon: "⚡",
                      title: "ACTION",
                      text:
                        camera_and_presentation
                          .action_presentation,
                    },
                    {
                      icon: "🎬",
                      title: "STORY",
                      text:
                        camera_and_presentation
                          .story_presentation,
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="bg-[#151A2D] border border-gray-800 rounded-2xl p-5"
                    >

                      <div className="text-2xl mb-4">
                        {item.icon}
                      </div>

                      <p className="text-xs text-pink-400 font-semibold tracking-wider mb-3">
                        {item.title}
                      </p>

                      <p className="text-gray-300 leading-7">
                        {item.text}
                      </p>

                    </div>
                  ))}

                </div>

              </div>
            )}

            {/* UI & HUD */}

            {activeSection === "ui" && (
              <div className="space-y-4">

                <div className="bg-[#151A2D] border border-pink-500/20 rounded-3xl p-6">

                  <p className="text-xs text-pink-400 font-semibold tracking-wider mb-3">
                    INTERFACE DIRECTION
                  </p>

                  <p className="text-lg text-gray-200 leading-8">
                    {ui_and_hud_style.overall_style}
                  </p>

                </div>

                <div className="grid lg:grid-cols-[1fr_0.8fr] gap-4">

                  <div className="bg-[#151A2D] border border-gray-800 rounded-3xl p-6">

                    <p className="text-xs text-pink-400 font-semibold tracking-wider mb-5">
                      HUD ELEMENTS
                    </p>

                    <div className="space-y-3">

                      {ui_and_hud_style.hud_elements?.map(
                        (element, index) => (
                          <div
                            key={`${element}-${index}`}
                            className="flex items-start gap-3 bg-[#0F172A] rounded-xl p-4"
                          >
                            <span className="text-pink-400 font-bold text-xs mt-1">
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            <p className="text-gray-300 text-sm leading-6">
                              {element}
                            </p>
                          </div>
                        )
                      )}

                    </div>

                  </div>

                  <div className="space-y-4">

                    <div className="bg-[#151A2D] border border-gray-800 rounded-3xl p-6">

                      <p className="text-xs text-pink-400 font-semibold tracking-wider mb-3">
                        MENU STYLE
                      </p>

                      <p className="text-gray-300 leading-7">
                        {ui_and_hud_style.menu_style}
                      </p>

                    </div>

                    <div className="bg-[#151A2D] border border-gray-800 rounded-3xl p-6">

                      <p className="text-xs text-pink-400 font-semibold tracking-wider mb-3">
                        PLAYER FEEDBACK
                      </p>

                      <p className="text-gray-300 leading-7">
                        {ui_and_hud_style.feedback_style}
                      </p>

                    </div>

                  </div>

                </div>

              </div>
            )}

          </motion.div>

        </AnimatePresence>

               {/* COMPLETION */}

        <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#151A2D] border border-gray-800 rounded-2xl px-6 py-6">

          <div>

            <p className="text-xs text-pink-400 font-semibold tracking-[0.2em] mb-2">
              VISUAL STYLE AGENT COMPLETED
            </p>

            <h2 className="text-2xl font-bold mb-2">
              Ready for the Final AI Agent
            </h2>

            <p className="text-gray-400 max-w-2xl leading-7">
              Every design agent has finished its task successfully.
              Generate the complete <span className="text-pink-400 font-semibold">Game Design Document</span>
              containing your game idea, story, characters, levels, gameplay and
              visual style in one professional document.
            </p>

          </div>

          <div className="flex flex-wrap gap-4">

            <button
              onClick={() => navigate("/gameplay")}
              className="px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-white/5 transition"
            >
              ← Back
            </button>

            <button
              onClick={() =>
                navigate("/game-design-document", {
                  state: {
                    gamePlan,
                    story,
                    characters,
                    levels,
                    gameplay,
                    visualStyle,
                  },
                })
              }
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:scale-105 transition-all duration-300 font-semibold shadow-lg"
            >
              📄 Generate Game Design Document →
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default VisualStyle;