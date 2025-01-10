import React, { useState, useEffect } from "react";
import Header from "./header";
import Footer from "./footer";
import bgImage from "../assets/bgimg.png"; // Import the background image

const Home = () => {
  const [displayedText, setDisplayedText] = useState(""); // Text to display
  const [currentWordIndex, setCurrentWordIndex] = useState(0); // Index of the current word
  const [charIndex, setCharIndex] = useState(0); // Index of the current character
  const words = ["live session", "project guideline"]; // Words to cycle through

  useEffect(() => {
    const typewriter = () => {
      const currentWord = words[currentWordIndex];
      
      if (charIndex < currentWord.length) {
        setDisplayedText((prev) => prev + currentWord[charIndex]); // Add the next character
        setCharIndex((prev) => prev + 1); // Move to the next character
      } else {
        setTimeout(() => {
          // Reset for the next word after a pause
          setDisplayedText("");
          setCharIndex(0);
          setCurrentWordIndex((prev) => (prev + 1) % words.length); // Cycle to the next word
        }, 1000); // Pause before clearing the word
      }
    };

    const interval = setTimeout(typewriter, 100); // Adjust the typing speed (100ms per letter)
    return () => clearTimeout(interval); // Clean up the timeout
  }, [charIndex, currentWordIndex, words]);

  return (
    <div>
      <Header />

      {/* Banner Section */}
      <div
        className="relative text-center text-white py-16"
        style={{
          backgroundImage: `url(${bgImage})`,
          objectFit: "cover",
          backgroundPosition: "center",
          height: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw", // Full viewport width
          margin: "0", // Remove default margins
          padding: "0", // Remove padding
        }}
      >
        <h1 className="text-4xl font-bold mb-4">
          Find a developer for <br />
          <span className="text-yellow-300 animate-pulse">{displayedText}</span>
        </h1>
        <button
          className="bg-white text-blue-900 border border-blue-900 py-3 px-10 rounded-full text-lg font-bold uppercase hover:bg-blue-900 hover:text-white transition-all duration-300"
          style={{
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderColor: "blue",
            color: "blue",
          }}
        >
          Get Help Now &gt;
        </button>
      </div>

      {/* Main Content */}
      <div className="container" style={{ marginTop: "60px" }}>
        <div className="row">
          {/* Placeholder for main content */}
          <div className="col-12">
            <h2 className="text-center font-bold text-2xl">Main Content Here</h2>
            {/* Add your main content below */}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
