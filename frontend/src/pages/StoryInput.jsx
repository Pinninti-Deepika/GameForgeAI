import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function StoryInput() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");

  const handleContinue = () => {
    if (!title || !genre || !description) {
      alert("Please fill all fields.");
      return;
    }

    const gamePlan = {
      title,
      genre,
      summary: description,
    };

    sessionStorage.setItem(
      "gamePlan",
      JSON.stringify(gamePlan)
    );

    navigate("/story");
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center px-6">

      <div className="w-full max-w-3xl bg-[#151A2D] rounded-3xl border border-gray-800 p-10">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-purple-500 mb-3"
        >
          Story Generator
        </motion.h1>

        <p className="text-gray-400 mb-8">
          Provide the required details to generate your game's story.
        </p>

        <div className="space-y-6">

          <div>
            <label className="block mb-2 text-gray-300">
              Game Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#0B0F19] border border-gray-700 focus:border-purple-500 outline-none"
              placeholder="Enter game title"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">
              Genre
            </label>

            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#0B0F19] border border-gray-700 focus:border-purple-500 outline-none"
              placeholder="Adventure, RPG, Horror..."
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">
              Story Idea
            </label>

            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#0B0F19] border border-gray-700 focus:border-purple-500 outline-none resize-none"
              placeholder="Describe your story idea..."
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleContinue}
            className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold text-lg"
          >
            Generate Story
          </motion.button>

        </div>

      </div>

    </div>
  );
}

export default StoryInput;