import { useEffect, useMemo } from 'react'
import { useLocalState } from './useLocalStorageState';

export function useColorScheme(): [
  isDark: boolean,
  setIsDark: (value: boolean) => void
] {
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  const [isDark, setIsDark] = useLocalState(undefined, 'colorScheme');

  const value = useMemo(() => isDark === undefined ? !!systemPrefersDark : isDark,
  [isDark, systemPrefersDark])
  
  const root = document.getElementById('root');

  useEffect(() => {
      if (!root) return

      setIsDark(value);
      root?.setAttribute('data-theme', value ? 'dark' : 'light');
  }, [value, isDark, setIsDark, root]);

  return [
    isDark,
    setIsDark
  ];
}

export default useColorScheme