import { useTheme } from "next-themes";

function useGetTheme() {
  const { theme } = useTheme();

  let systemIsDark = true;

  try {
    systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch (error) {}

  if (theme === "system") {
    return systemIsDark ? "dark" : "light";
  } else {
    return theme;
  }
}

export default useGetTheme;
