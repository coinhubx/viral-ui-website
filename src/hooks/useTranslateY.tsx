import { useEffect, useRef, useState } from "react";

export default function useTranslateY() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    window.addEventListener("resize", updateTranslateY);
    return () => window.removeEventListener("resize", updateTranslateY);
  }, []);

  useEffect(() => {
    updateTranslateY();
  }, [containerRef.current?.offsetHeight]);

  const updateTranslateY = () => {
    if (containerRef.current && titleRef.current) {
      const containerHeight = containerRef.current.offsetHeight;
      const titleTop = titleRef.current?.offsetTop;
      const titleHeight = titleRef.current?.offsetHeight;
      const dynamicTranslateY =
        containerHeight / 2 - (titleTop + titleHeight + 12);
      setTranslateY(dynamicTranslateY);
    }
  };

  return { translateY, containerRef, titleRef };
}
