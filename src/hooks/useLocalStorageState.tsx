import { useEffect, useState } from "react";

export function useLocalState(defaultValue: any, key: string) : [
  value: any,
  setValue: (value: any) => void
 ] {

  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultValue;
  });
  
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return  [ value, setValue ];
}
