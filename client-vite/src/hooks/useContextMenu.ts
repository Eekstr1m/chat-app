import { useState, useCallback, useRef } from "react";

export const useContextMenu = () => {
  const [menu, setMenu] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle right click menu
  const openContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setMenu({
      x: e.pageX,
      y: e.pageY,
      visible: true,
    });
  }, []);

  // Handle mobile long press
  const touchStartContextMenu = useCallback((e: React.TouchEvent) => {
    const delay = 600; // On press delay
    const touch = e.touches[0];
    timerRef.current = setTimeout(() => {
      setMenu({
        x: touch.pageX,
        y: touch.pageY,
        visible: true,
      });
    }, delay);
  }, []);

  // Handle end long press
  const touchEndContextMenu = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // Handle close context menu
  const closeContextMenu = useCallback(() => {
    setMenu((prev) => ({ ...prev, visible: false }));
  }, []);

  return {
    menu,
    openContextMenu,
    touchStartContextMenu,
    touchEndContextMenu,
    closeContextMenu,
  };
};
