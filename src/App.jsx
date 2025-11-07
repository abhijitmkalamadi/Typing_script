import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";

function App() {
  const textSamples = [
    "Technology has become an inseparable part of our lives, influencing the way we communicate, work, learn, and even think about the future of humanity.",
    "The ability to type quickly and accurately is an essential skill in the digital age, helping people save time and increase productivity in almost every field.",
    "Every morning brings a new opportunity to learn something different, to challenge your limits, and to move one step closer to your dreams",
  ];

  const [theme, setTheme] = useState("light");
  const [page, setPage] = useState(1);
  const [text, setText] = useState(textSamples[0]);
  const [input, setInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [completed, setCompleted] = useState(false);
  const [timeTaken, setTimeTaken] = useState(null);

  const timerRef = useRef(null);

  // Start the timer when typing begins
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
  };

  // Stop timer
  const stopTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
  };

  // Handle typing
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!isRunning) startTimer();
    setInput(value);
    calculateResults(value);

    // Auto-end when user finishes text
    if (value.trim() === text.trim()) {
      if (page === 2) {
        handleEndTask();
      } else {
        handleNext();
      }
    }
  };

  // Calculate WPM & Accuracy
  const calculateResults = (currentInput) => {
    const wordsTyped = currentInput.trim().split(/\s+/).filter(Boolean).length;
    const wpmValue = elapsed > 0 ? Math.round((wordsTyped / elapsed) * 60) : 0;

    let correctChars = 0;
    for (let i = 0; i < currentInput.length; i++) {
      if (currentInput[i] === text[i]) correctChars++;
    }

    const accuracyValue =
      currentInput.length > 0
        ? Math.round((correctChars / currentInput.length) * 100)
        : 100;

    setWpm(wpmValue);
    setAccuracy(accuracyValue);
  };

  // Next text
  const handleNext = () => {
    if (page === 1) {
      setPage(2);
      setText(textSamples[1]);
      setInput("");
    }
  };

  // End Task button handler
  const handleEndTask = () => {
    stopTimer();
    setCompleted(true);
    setTimeTaken(elapsed);
  };

  // Restart all
  const resetGame = () => {
    stopTimer();
    setPage(1);
    setText(textSamples[0]);
    setInput("");
    setElapsed(0);
    setCompleted(false);
    setWpm(0);
    setAccuracy(100);
    setTimeTaken(null);
  };

  // Dark/Light Mode Toggle
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    document.body.style.background =
      theme === "light"
        ? "linear-gradient(135deg, #ffe9f0, #fff3f7)"
        : "linear-gradient(135deg, #0f2027, #203a43, #2c5364)";
    document.body.style.color = theme === "light" ? "#333" : "#eee";
    return () => clearInterval(timerRef.current);
  }, [theme]);

  // Show result card
  if (completed) {
    return (
      <div style={styles(theme).container}>
        <h1 style={styles(theme).title}>🎉 TypingSprint Results</h1>
        <div style={styles(theme).resultCard}>
          <p style={styles(theme).resultText}>🕒 Time Taken: <b>{timeTaken}s</b></p>
          <p style={styles(theme).resultText}>⚡ Speed: <b>{wpm} WPM</b></p>
          <p style={styles(theme).resultText}>🎯 Accuracy: <b>{accuracy}%</b></p>
        </div>
        <button style={styles(theme).button} onClick={resetGame}>
          🔁 Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles(theme).container}>
      <div style={styles(theme).header}>
        <h1 style={styles(theme).title}>⌨️ TypingSprint – Test {page}/2</h1>
        <div style={styles(theme).toggleSwitch} onClick={toggleTheme}>
          <div
            style={{
              ...styles(theme).slider,
              transform:
                theme === "light" ? "translateX(0)" : "translateX(25px)",
            }}
          ></div>
          <span style={styles(theme).modeIcon}>
            {theme === "light" ? "🌞" : "🌙"}
          </span>
        </div>
      </div>

      <Card text={text} input={input} theme={theme} />

      <textarea
        style={styles(theme).textArea}
        value={input}
        onChange={handleInputChange}
        placeholder="Start typing here..."
      />

      <div style={styles(theme).stats}>
        <p>⏱ Elapsed: {elapsed}s</p>
        <p>⚡ Speed: {wpm} WPM</p>
        <p>🎯 Accuracy: {accuracy}%</p>
      </div>

      <div>
        <button style={styles(theme).button} onClick={resetGame}>
          🔁 Restart
        </button>
        {page === 1 && (
          <button style={styles(theme).nextButton} onClick={handleNext}>
            ➡️ Next
          </button>
        )}
        <button style={styles(theme).endButton} onClick={handleEndTask}>
          🛑 End Task
        </button>
      </div>
    </div>
  );
}

const styles = (theme) => ({
  container: {
    maxWidth: "750px",
    margin: "50px auto",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
    transition: "all 0.4s ease-in-out",
    color: theme === "light" ? "#333" : "#fff",
  },
  title: {
    fontSize: "2.3rem",
    color: theme === "light" ? "#ff4da6" : "#ffa6ff",
    marginBottom: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  textArea: {
    width: "100%",
    height: "130px",
    border: theme === "light" ? "2px solid #ffb6c1" : "2px solid #888",
    borderRadius: "12px",
    padding: "12px",
    fontSize: "1rem",
    outline: "none",
    marginBottom: "25px",
    backgroundColor: theme === "light" ? "#fff" : "#1e1e1e",
    color: theme === "light" ? "#333" : "#eee",
    transition: "0.3s",
  },
  stats: {
    display: "flex",
    justifyContent: "space-around",
    fontSize: "1.1rem",
    marginBottom: "15px",
  },
  button: {
    backgroundColor: "#ff4da6",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "10px 25px",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "10px",
    transition: "0.3s",
  },
  nextButton: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "10px 25px",
    fontSize: "1rem",
    cursor: "pointer",
    marginLeft: "10px",
    marginTop: "10px",
    transition: "0.3s",
  },
  endButton: {
    backgroundColor: "#ff6347",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "10px 25px",
    fontSize: "1rem",
    cursor: "pointer",
    marginLeft: "10px",
    marginTop: "10px",
    transition: "0.3s",
  },
  resultCard: {
    backgroundColor:
      theme === "light" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.05)",
    padding: "30px",
    borderRadius: "20px",
    boxShadow:
      theme === "light"
        ? "0 6px 20px rgba(0,0,0,0.1)"
        : "0 6px 20px rgba(255,255,255,0.1)",
    maxWidth: "400px",
    margin: "30px auto",
    border: "2px solid " + (theme === "light" ? "#ffb6c1" : "#666"),
  },
  resultText: {
    fontSize: "1.2rem",
    margin: "10px 0",
  },
  toggleSwitch: {
    position: "relative",
    width: "50px",
    height: "25px",
    backgroundColor: theme === "light" ? "#ddd" : "#555",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "0.3s",
  },
  slider: {
    position: "absolute",
    top: "3px",
    left: "3px",
    width: "20px",
    height: "20px",
    backgroundColor: "#fff",
    borderRadius: "50%",
    transition: "transform 0.3s ease",
  },
  modeIcon: {
    position: "absolute",
    right: "-30px",
    top: "2px",
    fontSize: "1.2rem",
  },
});

export default App;
