import { useState } from "react";
import Desktop from "./os/Desktop";
import Fallback from "./components/Fallback";
import { BootScreen } from "./os/BootScreen";
import { useReducedMotion } from "./hooks";

export default function App() {
  const reduced = useReducedMotion();
  const [textMode, setTextMode] = useState(reduced);
  const [booted, setBooted] = useState(false);

  if (textMode) return <Fallback onDesktop={() => setTextMode(false)} />;

  return (
    <>
      <Desktop onTextMode={() => setTextMode(true)} />
      {!booted && !reduced && (
        <BootScreen onDone={() => setBooted(true)} />
      )}
    </>
  );
}
