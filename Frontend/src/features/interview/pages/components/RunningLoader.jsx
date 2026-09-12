const styles = `
  @keyframes run-body {
    0%,100% { transform: rotate(-2deg) translateY(0px); }
    25%      { transform: rotate(2deg)  translateY(-6px); }
    50%      { transform: rotate(-1deg) translateY(-2px); }
    75%      { transform: rotate(1deg)  translateY(-8px); }
  }
  @keyframes arm-front {
    0%,100% { transform: rotate(-40deg); }
    50%      { transform: rotate(50deg);  }
  }
  @keyframes arm-back {
    0%,100% { transform: rotate(50deg);  }
    50%      { transform: rotate(-40deg); }
  }
  @keyframes leg-front {
    0%,100% { transform: rotate(-50deg); }
    50%      { transform: rotate(60deg);  }
  }
  @keyframes leg-back {
    0%,100% { transform: rotate(60deg);  }
    50%      { transform: rotate(-50deg); }
  }
  @keyframes shin-front {
    0%,100% { transform: rotate(10deg);  }
    25%      { transform: rotate(50deg);  }
    50%      { transform: rotate(5deg);   }
    75%      { transform: rotate(80deg);  }
  }
  @keyframes shin-back {
    0%,100% { transform: rotate(80deg);  }
    25%      { transform: rotate(5deg);   }
    50%      { transform: rotate(50deg);  }
    75%      { transform: rotate(10deg);  }
  }
  @keyframes head-bob {
    0%,100% { transform: translateY(0px)  rotate(-3deg); }
    50%      { transform: translateY(-5px) rotate(2deg);  }
  }
  @keyframes ground-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-60px); }
  }
  @keyframes trail-fade {
    0%   { opacity: 0.6; transform: scaleX(1); }
    100% { opacity: 0;   transform: scaleX(0); }
  }
  @keyframes dot1 { 0%,100%{opacity:0.15} 33%{opacity:1} }
  @keyframes dot2 { 0%,100%{opacity:0.15} 66%{opacity:1} }
  @keyframes dot3 { 0%,100%{opacity:0.15} 99%{opacity:1} }
 
  .rl-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #0f1117;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
    font-family: 'Inter', sans-serif;
  }
 
  .rl-scene {
    position: relative;
    width: 200px;
    height: 130px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
 
  /* figure sits on the ground line */
  .rl-figure {
    position: absolute;
    bottom: 18px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 90px;
  }
 
  /* HEAD */
  .rl-head {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #e8215e;
    animation: head-bob 0.42s ease-in-out infinite;
    transform-origin: center bottom;
  }
 
  /* TORSO */
  .rl-torso {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 26px;
    border-radius: 4px;
    background: #e8215e;
    animation: run-body 0.42s ease-in-out infinite;
    transform-origin: center top;
  }
 
  /* ARMS — pivot from shoulder (top of torso) */
  .rl-arm-wrap {
    position: absolute;
    top: 22px;
    left: 50%;
    width: 0;
    height: 0;
    transform: translateX(-50%);
  }
  .rl-arm {
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 20px;
    border-radius: 3px;
    background: #e8215e;
    transform-origin: top center;
  }
  .rl-arm.front { animation: arm-front 0.42s ease-in-out infinite; margin-left: -4px; }
  .rl-arm.back  { animation: arm-back  0.42s ease-in-out infinite; margin-left:  0px; opacity: 0.5; }
 
  /* FOREARMS */
  .rl-forearm {
    position: absolute;
    top: 18px;
    left: 0;
    width: 5px;
    height: 16px;
    border-radius: 3px;
    background: #c8184f;
    transform-origin: top center;
  }
  .rl-arm.front .rl-forearm { animation: shin-back  0.42s ease-in-out infinite; }
  .rl-arm.back  .rl-forearm { animation: shin-front 0.42s ease-in-out infinite; }
 
  /* HIPS */
  .rl-hip-wrap {
    position: absolute;
    top: 44px;
    left: 50%;
    width: 0;
    height: 0;
    transform: translateX(-50%);
  }
  .rl-thigh {
    position: absolute;
    top: 0;
    left: 0;
    width: 7px;
    height: 22px;
    border-radius: 3px;
    background: #ff6b9d;
    transform-origin: top center;
  }
  .rl-thigh.front { animation: leg-front 0.42s ease-in-out infinite; margin-left: -4px; }
  .rl-thigh.back  { animation: leg-back  0.42s ease-in-out infinite; margin-left:  0px; opacity: 0.5; }
 
  /* SHINS */
  .rl-shin {
    position: absolute;
    top: 20px;
    left: 0;
    width: 6px;
    height: 20px;
    border-radius: 3px;
    background: #e8215e;
    transform-origin: top center;
  }
  .rl-thigh.front .rl-shin { animation: shin-front 0.42s ease-in-out infinite; }
  .rl-thigh.back  .rl-shin { animation: shin-back  0.42s ease-in-out infinite; }
 
  /* FEET */
  .rl-foot {
    position: absolute;
    bottom: -4px;
    left: -4px;
    width: 14px;
    height: 6px;
    border-radius: 3px;
    background: #c8184f;
  }
 
  /* GROUND LINE */
  .rl-ground {
    position: absolute;
    bottom: 0;
    left: -40px;
    right: -40px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #e8215e44 20%, #e8215e88 50%, #e8215e44 80%, transparent);
    border-radius: 1px;
    overflow: hidden;
  }
  .rl-ground-scroll {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 18px,
      #e8215e55 18px,
      #e8215e55 30px
    );
    animation: ground-scroll 0.42s linear infinite;
  }
 
  /* MOTION TRAILS */
  .rl-trail {
    position: absolute;
    bottom: 20px;
    border-radius: 2px;
    background: #e8215e;
    transform-origin: right center;
    animation: trail-fade 0.42s ease-out infinite;
  }
  .rl-trail:nth-child(1) { right: 100px; width: 18px; height: 3px; top: 30px; animation-delay: 0s;     opacity: 0.5; }
  .rl-trail:nth-child(2) { right: 108px; width: 12px; height: 2px; top: 42px; animation-delay: 0.07s;  opacity: 0.3; }
  .rl-trail:nth-child(3) { right: 114px; width: 8px;  height: 2px; top: 22px; animation-delay: 0.14s;  opacity: 0.2; }
 
  /* DOTS */
  .rl-dots {
    display: flex;
    gap: 7px;
    margin-top: 16px;
  }
  .rl-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #e8215e;
  }
  .rl-dot:nth-child(1) { animation: dot1 1s ease-in-out infinite; }
  .rl-dot:nth-child(2) { animation: dot2 1s ease-in-out infinite; }
  .rl-dot:nth-child(3) { animation: dot3 1s ease-in-out infinite; }
`;
 
export default function RunningLoader() {
  return (
    <>
      <style>{styles}</style>
      <div className="rl-overlay">
        <div className="rl-scene">
 
          {/* Motion trails */}
          <div className="rl-trail" />
          <div className="rl-trail" />
          <div className="rl-trail" />
 
          {/* Runner figure */}
          <div className="rl-figure">
 
            {/* Head */}
            <div className="rl-head" />
 
            {/* Torso */}
            <div className="rl-torso" />
 
            {/* Arms */}
            <div className="rl-arm-wrap">
              <div className="rl-arm front">
                <div className="rl-forearm" />
              </div>
              <div className="rl-arm back">
                <div className="rl-forearm" />
              </div>
            </div>
 
            {/* Legs */}
            <div className="rl-hip-wrap">
              <div className="rl-thigh front">
                <div className="rl-shin">
                  <div className="rl-foot" />
                </div>
              </div>
              <div className="rl-thigh back">
                <div className="rl-shin">
                  <div className="rl-foot" />
                </div>
              </div>
            </div>
 
          </div>
 
          {/* Ground */}
          <div className="rl-ground">
            <div className="rl-ground-scroll" />
          </div>
 
        </div>
 
        {/* Dots */}
        <div className="rl-dots">
          <div className="rl-dot" />
          <div className="rl-dot" />
          <div className="rl-dot" />
        </div>
      </div>
    </>
  );
}