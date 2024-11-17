import Config from "./Config.js";

let Cfg = {
  scale(pct = 1) {
    const renderScale = Config.other?.renderScale || 100;
    const scale = Math.min(2, Math.max(0.5, renderScale / 100));
    pct = pct * scale;
    return `style=transform:scale(${pct})`;
  },
};

export default Cfg;
