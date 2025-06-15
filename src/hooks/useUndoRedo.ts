
import { useState, useCallback } from 'react';

const HISTORY_LIMIT = 50;

export const useUndoRedo = <T,>(initialState: T) => {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [pointer, setPointer] = useState(0);

  const present = history[pointer];

  const set = useCallback((newState: T) => {
    if (JSON.stringify(present) === JSON.stringify(newState)) {
        return;
    }
    const newHistory = history.slice(0, pointer + 1);
    
    newHistory.push(newState);

    while (newHistory.length > HISTORY_LIMIT) {
        newHistory.shift();
    }
    
    const newPointer = newHistory.length - 1;

    setHistory(newHistory);
    setPointer(newPointer);
  }, [history, pointer, present]);

  const undo = useCallback(() => {
    if (pointer > 0) {
      setPointer(p => p - 1);
    }
  }, [pointer]);

  const redo = useCallback(() => {
    if (pointer < history.length - 1) {
      setPointer(p => p + 1);
    }
  }, [pointer, history.length]);
  
  const reset = useCallback((newState: T) => {
      setHistory([newState]);
      setPointer(0);
  }, []);

  const canUndo = pointer > 0;
  const canRedo = pointer < history.length - 1;

  return { state: present, set, undo, redo, reset, canUndo, canRedo };
};
