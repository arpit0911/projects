import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [lotteryTicket, setLotteryTicket] = useState(0);
  const [isWin, setIsWin] = useState(false);

  const generateLotteryTicket = () => {
    let threeDigitLotteryNumber =
      Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
    console.log("ticket number", typeof threeDigitLotteryNumber);
    setLotteryTicket(threeDigitLotteryNumber);
    // calculate is the sum of three digits is == 15
    let sum = 0;
    while (threeDigitLotteryNumber) {
      let r = threeDigitLotteryNumber % 10;
      sum += r;
      threeDigitLotteryNumber = Math.floor(threeDigitLotteryNumber / 10);
    }
    if (sum === 15) {
      setIsWin(true);
    } else {
      setIsWin(false);
    }
    console.log("sum", sum);
  };

  return (
    <>
      <div>
        <h2>{isWin ? "Lottery 'Congratulations', you won" : "Lottery"}</h2>
        <h4>Lottery Ticket = {lotteryTicket}</h4>
        <button onClick={generateLotteryTicket}>Generate new Ticket</button>
      </div>
    </>
  );
}

export default App;
