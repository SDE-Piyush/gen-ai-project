import { useState, useEffect } from "react";

const spinMessages = [
  "Analyzing your resume...",
  "Matching skills to role...",
  "Crafting smart questions...",
  "Building your road map...",
  "Calculating match score...",
];

const initialSteps = [
  { id: 1, label: "Parsing job description", status: "done" },
  { id: 2, label: "Extracting skills from resume", status: "done" },
  { id: 3, label: "Generating interview questions", status: "active" },
  { id: 4, label: "Building road map", status: "pending" },
  { id: 5, label: "Calculating match score", status: "pending" },
];

const styles = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes spin-reverse {
    to { transform: rotate(-360deg); }
  }
  @keyframes dot-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40% { transform: translateY(-6px); opacity: 1; }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes label-swap {
    0%   { opacity: 1; transform: translateY(0); }
    40%  { opacity: 0; transform: translateY(-8px); }
    60%  { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  .ai-spinner-wrapper {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #0f1117;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 28px;
    padding: 40px 24px;
    font-family: 'Inter', sans-serif;
  }

  .spinner-wrap {
    position: relative;
    width: 84px;
    height: 84px;
  }
  .ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #e8215e;
    animation: spin 1s linear infinite;
  }
  .ring-inner {
    position: absolute;
    inset: 10px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-right-color: #ff6b9d;
    animation: spin-reverse 1.4s linear infinite;
  }
  .ring-icon {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spin-label-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .spin-label {
    font-size: 15px;
    font-weight: 500;
    color: #e2e8f0;
    animation: label-swap 0.4s ease;
  }
  .spin-sublabel {
    font-size: 13px;
    color: #6b7280;
  }
  .dots {
    display: flex;
    gap: 5px;
    margin-top: 6px;
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #e8215e;
  }

  .steps-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 320px;
  }
  .step-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 14px;
    border-radius: 8px;
    background: #14171f;
    border: 0.5px solid #1e2130;
    animation: fadeInUp 0.3s ease;
    transition: border-color 0.3s;
  }
  .step-row.step-active {
    border-color: #e8215e40;
  }
  .step-dot-el {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .step-dot-el.done    { background: #22c55e; }
  .step-dot-el.active  { background: #e8215e; animation: pulse-dot 1s ease-in-out infinite; }
  .step-dot-el.pending { background: #374151; }
  .step-label-text {
    font-size: 13px;
    color: #9ca3af;
    flex: 1;
  }
  .step-label-text.done-text   { color: #e2e8f0; }
  .step-label-text.active-text { color: #e2e8f0; }
  .step-check { font-size: 12px; color: #22c55e; }
  .step-active-ind { font-size: 12px; color: #e8215e; }
`;

export default function AISpinnerLoader() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [labelKey, setLabelKey] = useState(0);
  const [steps, setSteps] = useState(initialSteps);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex(i => (i + 1) % spinMessages.length);
      setLabelKey(k => k + 1);

      setSteps(prev => {
        const activeIdx = prev.findIndex(s => s.status === "active");
        if (activeIdx === -1 || activeIdx === prev.length - 1) return prev;
        return prev.map((s, i) => {
          if (i === activeIdx) return { ...s, status: "done" };
          if (i === activeIdx + 1) return { ...s, status: "active" };
          return s;
        });
      });
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="ai-spinner-wrapper">

        {/* Spinner */}
        <div className="spinner-wrap">
          <div className="ring" />
          <div className="ring-inner" />
          <div className="ring-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="#e8215e" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2L15 8L21 9L16.5 14L17.5 20L12 17L6.5 20L7.5 14L3 9L9 8Z"/>
            </svg>
          </div>
        </div>

        {/* Label */}
        <div className="spin-label-wrap">
          <span key={labelKey} className="spin-label">{spinMessages[msgIndex]}</span>
          <span className="spin-sublabel">AI-powered strategy generation</span>
          <div className="dots">
            {[0, 1, 2].map(i => (
              <div key={i} className="dot"
                style={{ animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="steps-list">
          {steps.map(step => (
            <div key={step.id}
              className={`step-row${step.status === "active" ? " step-active" : ""}`}>
              <div className={`step-dot-el ${step.status}`} />
              <span className={`step-label-text ${step.status === "done" ? "done-text" : step.status === "active" ? "active-text" : ""}`}>
                {step.label}
              </span>
              {step.status === "done"    && <span className="step-check">✓</span>}
              {step.status === "active"  && <span className="step-active-ind">...</span>}
            </div>
          ))}
        </div>

      </div>
    </>
  );
}