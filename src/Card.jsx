import React from "react";

const Card = ({ text, input, theme }) => {
  const getHighlightedText = () => {
    return text.split("").map((char, index) => {
      let color = "";
      if (index < input.length) {
        color =
          input[index] === char
            ? "rgba(0,255,0,0.3)" // correct
            : "rgba(255,0,0,0.3)"; // incorrect
      }
      return (
        <span key={index} style={{ backgroundColor: color }}>
          {char}
        </span>
      );
    });
  };

  return <div style={styles(theme).textBox}>{getHighlightedText()}</div>;
};

const styles = (theme) => ({
  textBox: {
    border: theme === "light" ? "2px solid #ffb6c1" : "2px solid #777",
    borderRadius: "15px",
    padding: "18px",
    textAlign: "left",
    backgroundColor: theme === "light" ? "#fff" : "#1e1e1e",
    marginBottom: "20px",
    fontSize: "1.1rem",
    lineHeight: "1.6",
    boxShadow:
      theme === "light"
        ? "0 4px 10px rgba(0,0,0,0.1)"
        : "0 4px 10px rgba(255,255,255,0.1)",
    transition: "0.3s",
  },
});

export default Card;
