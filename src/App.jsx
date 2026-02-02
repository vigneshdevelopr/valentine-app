import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import "./App.css";

export default function App() {

  const buttonsRef = useRef(null);
  const noBtnRef = useRef(null);

  const [accepted, setAccepted] = useState(false);

  // absolute coordinates INSIDE buttons container
  const [pos, setPos] = useState({ x: 120, y: 20 });

  const [yesScale, setYesScale] = useState(1);
  const [noScale, setNoScale] = useState(1);

  /* ✅ Ensure button starts inside container */
  useEffect(() => {
    const container = buttonsRef.current;
    const btn = noBtnRef.current;

    if (!container || !btn) return;

    const maxX = container.clientWidth - btn.clientWidth;
    const maxY = container.clientHeight - btn.clientHeight;

    setPos({
      x: Math.min(120, maxX),
      y: Math.min(20, maxY)
    });

  }, []);

  const runAway = (e) => {

    const container = buttonsRef.current;
    const btn = noBtnRef.current;

    if (!container || !btn) return;

    const btnRect = btn.getBoundingClientRect();

    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const dx = btnCenterX - e.clientX;
    const dy = btnCenterY - e.clientY;

    const distance = Math.hypot(dx, dy);

    // trigger radius
    if (distance < 130) {

      const force = 160;

      const moveX = (dx / distance) * force;
      const moveY = (dy / distance) * force;

      let newX = pos.x + moveX;
      let newY = pos.y + moveY;

      /* ✅ TRUE CONTAINER CLAMP */

      const maxX = container.clientWidth - btn.clientWidth;
      const maxY = container.clientHeight - btn.clientHeight;

      newX = Math.max(0, Math.min(maxX, newX));
      newY = Math.max(0, Math.min(maxY, newY));

      setPos({ x: newX, y: newY });

      // psychological pressure 😈
      setYesScale(prev => Math.min(prev + 0.05, 1.7));
      setNoScale(prev => Math.max(prev - 0.04, 0.6));
    }
  };

  const celebrate = () => {

    setAccepted(true);

    confetti({
      particleCount: 250,
      spread: 140,
      origin: { y: 0.6 },
    });

    new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3"
    ).play();
  };

  if (accepted) {
    return (
      <div className="celebration">
        <img
          className="kiss"
          src="https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif"
          alt="celebration"
        />
        <h1>She Said YES ❤️</h1>
      </div>
    );
  }

  return (
    <div className="app">

      <div className="card">

        <img
          className="cat"
          src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
          alt="cat"
        />

        <h2>Goyal, will you be my Valentine? 💘</h2>

        <div
          className="buttons"
          ref={buttonsRef}
          onMouseMove={runAway}
        >

          <button
            className="yes"
            onClick={celebrate}
            style={{
              transform: `scale(${yesScale})`
            }}
          >
            YES 💖
          </button>

          <button
            ref={noBtnRef}
            className="no"
            style={{
              left: pos.x,
              top: pos.y,
              transform: `scale(${noScale})`
            }}
          >
            NO 😜
          </button>

        </div>
      </div>
    </div>
  );
}
