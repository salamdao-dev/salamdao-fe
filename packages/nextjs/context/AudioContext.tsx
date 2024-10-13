import React, { createContext, useContext, useState } from "react";

interface AudioContextType {
  shouldPlayAudio: boolean;
  setShouldPlayAudio: React.Dispatch<React.SetStateAction<boolean>>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shouldPlayAudio, setShouldPlayAudio] = useState(false);

  return <AudioContext.Provider value={{ shouldPlayAudio, setShouldPlayAudio }}>{children}</AudioContext.Provider>;
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
