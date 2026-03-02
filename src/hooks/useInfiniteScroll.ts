import { useEffect, useRef, useState } from "react";

export function useInfiniteScroll(data: any[], pageSize: number) {
  const [count, setCount] = useState(pageSize);
  const loadingRef = useRef(false); 


  useEffect(() => {
    setCount(pageSize);
    loadingRef.current = false;
  }, [data, pageSize]);

  function handleScroll(container: HTMLElement | null) {
    if (!container) return;
    if (loadingRef.current) return; 

    const { scrollTop, clientHeight, scrollHeight } = container;

    const reachedBottom =
      scrollTop + clientHeight >= scrollHeight - 40;

    if (reachedBottom && count < data.length) {
      loadingRef.current = true; 


      setTimeout(() => {
        setCount((prev) =>
          Math.min(prev + pageSize, data.length)
        );
        loadingRef.current = false; 
      }, 300); 
    }
  }

  return {
    visible: data.slice(0, count),
    handleScroll,
  };
}