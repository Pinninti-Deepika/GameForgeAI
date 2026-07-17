import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">

      {/* Hero Section */}
      <section className="px-6 pt-24 pb-16">

        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">

          {/* Floating Logo */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl"
          >
            🎮
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mt-6 text-6xl md:text-7xl font-extrabold text-purple-500"
          >
            GameForge AI Designer
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-2xl text-gray-300 max-w-3xl"
          >
            Transform your ideas into complete game worlds with Agentic AI.
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-5 text-gray-400 max-w-3xl leading-8 text-lg"
          >
            Generate game concepts, immersive stories, intelligent characters,
            exciting quests, detailed levels and a complete Game Design
            Document—all from a single game idea.
          </motion.p>

          {/* Button */}
          <motion.button
            whileHover={{
              scale: 1.08,
              boxShadow: "0px 0px 30px rgb(168 85 247)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/generate")}
            className="mt-10 px-10 py-4 rounded-xl bg-purple-600 text-xl font-semibold hover:bg-purple-700 transition"
          >
            🚀 Start Designing
          </motion.button>

        </div>

      </section>

      {/* Feature Cards */}
      <section className="px-6 pb-20">

        <div className="max-w-6xl mx-auto">

          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Everything You Need To Design A Game
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Card 1 */}
            <motion.div
              whileHover={{
                y: -8,
                borderColor: "#a855f7"
              }}
              className="bg-[#151A2D] p-8 rounded-2xl border border-gray-800 transition"
            >
              <div className="text-5xl mb-5">🧠</div>

              <h3 className="text-2xl font-semibold mb-4">
                AI Game Planner
              </h3>

              <p className="text-gray-400 leading-7">
                Transform a simple game idea into a structured Game Design Plan
                that becomes the foundation for every other AI module.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              whileHover={{
                y: -8,
                borderColor: "#a855f7"
              }}
              className="bg-[#151A2D] p-8 rounded-2xl border border-gray-800 transition"
            >
              <div className="text-5xl mb-5">📖</div>

              <h3 className="text-2xl font-semibold mb-4">
                Story & Characters
              </h3>

              <p className="text-gray-400 leading-7">
                Automatically generate rich stories, memorable characters,
                engaging dialogues and exciting quests for your game.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              whileHover={{
                y: -8,
                borderColor: "#a855f7"
              }}
              className="bg-[#151A2D] p-8 rounded-2xl border border-gray-800 transition"
            >
              <div className="text-5xl mb-5">📄</div>

              <h3 className="text-2xl font-semibold mb-4">
                Export GDD
              </h3>

              <p className="text-gray-400 leading-7">
                Export a professional Game Design Document containing every
                detail required before game development begins.
              </p>
            </motion.div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Landing;