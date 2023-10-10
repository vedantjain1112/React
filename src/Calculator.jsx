import React, { useState, useEffect } from "react";
import "./Calculator.scss";

function Calculator() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);

  const handleButtonClick = (value) => {
    if (value === "X") {
      setInput((prevInput) => prevInput.slice(0, -1));
    } else {
      setInput((prevInput) => prevInput + value);
    }
  };

  const handleClear = () => {
    setInput("");
  };

  const handleDelete = () => {
    setInput((prevInput) => prevInput.slice(0, -1));
  };

  const handleCalculate = () => {
    try {
      const result = eval(input).toString();
      setInput(result);
      setHistory((prevHistory) => [...prevHistory, `${input} = ${result}`]);
    } catch (error) {
      setInput("Error");
    }
  };

  const handleKeyPress = (event) => {
    const key = event.key;
    if (/\d|[+*/%()-]/.test(key)) {
      handleButtonClick(key);
    } else if (key === "Backspace") {
      handleDelete();
    } else if (key === "Enter" || key === "=") {
      handleCalculate();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [input]);

  return (
    <div className="calculator">
      <input type="text" value={input} readOnly className="input-field" />
      <div className="buttons">
        <button onClick={() => handleClear()} className="button">
          C
        </button>
        <button onClick={() => handleDelete()} className="button">
          CE
        </button>
        <button onClick={() => handleButtonClick("X")} className="button">
          X
        </button>
        <button onClick={() => handleButtonClick("(")} className="button">
          (
        </button>
        <button onClick={() => handleButtonClick(")")} className="button">
          )
        </button>

        <button onClick={() => handleButtonClick("7")}>7</button>
        <button onClick={() => handleButtonClick("8")}>8</button>
        <button onClick={() => handleButtonClick("9")}>9</button>
        <button onClick={() => handleButtonClick("/")}>/</button>

        <button onClick={() => handleButtonClick("4")}>4</button>
        <button onClick={() => handleButtonClick("5")}>5</button>
        <button onClick={() => handleButtonClick("6")}>6</button>
        <button onClick={() => handleButtonClick("*")}>*</button>

        <button onClick={() => handleButtonClick("1")}>1</button>
        <button onClick={() => handleButtonClick("2")}>2</button>
        <button onClick={() => handleButtonClick("3")}>3</button>
        <button onClick={() => handleButtonClick("-")}>-</button>

        <button onClick={() => handleButtonClick("0")}>0</button>
        <button onClick={() => handleButtonClick("00")}>00</button>
        <button onClick={() => handleButtonClick("%")}>%</button>
        <button onClick={() => handleButtonClick("+")}>+</button>

        <button onClick={() => handleButtonClick(".")} className="button">
          .
        </button>

        <button onClick={() => handleClear()} className="button">
          Clear
        </button>
        <button
          onClick={() => handleCalculate()}
          className="button equal-button"
        >
          =
        </button>
      </div>

      <div className="history">
        <h2>History</h2>
        <ul>
          {history.map((calculation, index) => (
            <li key={index}>{calculation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Calculator;
