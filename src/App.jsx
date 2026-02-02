import { useRef, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import "./App.css";

export default function App() {

  const containerRef = useRef(null);
  const noBtnRef = useRef(null);

  const [accepted, setAccepted] = useState(false);

  const position = useRef({
    x: 160,
    y: 90
  });

  /* Move button ONLY when cursor is close */
  const detectCursor = (e) => {

    const btn = noBtnRef.current;
    const container = containerRef.current;

    if (!btn || !container) return;

    const rect = btn.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = centerX - e.clientX;
    const dy = centerY - e.clientY;

    const distance = Math.hypot(dx, dy);

    /* 🔥 DANGER ZONE */
    if (distance < 140) {

      const maxX =
        container.clientWidth - btn.clientWidth;

      const maxY =
        container.clientHeight - btn.clientHeight;

      let newX, newY;

      /* ensure new position is FAR */
      do {
        newX = Math.random() * maxX;
        newY = Math.random() * maxY;

      } while (
        Math.hypot(newX - position.current.x,
                   newY - position.current.y) < 120
      );

      position.current = { x: newX, y: newY };

      btn.style.left = newX + "px";
      btn.style.top = newY + "px";
    }
  };

  const celebrate = () => {

    setAccepted(true);

    confetti({
      particleCount: 260,
      spread: 150,
      origin: { y: 0.6 },
    });

    new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3"
    ).play();
  };

  /* set initial position */
  useEffect(() => {

    const btn = noBtnRef.current;

    btn.style.left = position.current.x + "px";
    btn.style.top = position.current.y + "px";

  }, []);

  if (accepted) {
    return (
      <div className="celebration">
        <img
          className="kiss"
          src="https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif"
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
        />

        <h2>
          Hi, it's Goyal 😊  
          Will you be my Valentine? 💗
        </h2>

        <div
          className="buttons"
          ref={containerRef}
          onMouseMove={detectCursor}
        >

          <button
            className="yes"
            onClick={celebrate}
          >
            YES 💖
          </button>

          <button
            ref={noBtnRef}
            className="no"
          >
            NO 😜
          </button>

        </div>
      </div>
    </div>
  );
}
