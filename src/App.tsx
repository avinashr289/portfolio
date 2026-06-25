import { useState } from "react";
import Desktop from "./os/Desktop";
import Fallback from "./components/Fallback";
import { useReducedMotion } from "./hooks";

export default function App() {
  const reduced = useReducedMotion();
  // Reduced-motion users land in Text Mode by default; everyone can toggle.
  const [textMode, setTextMode] = useState(reduced);

  if (textMode) return <Fallback onDesktop={() => setTextMode(false)} />;
  return <Desktop onTextMode={() => setTextMode(true)} />;
}
