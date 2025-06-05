"use client"

import { useState, useEffect } from "react"

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    let initialIsDark = false;

    if (storedTheme === "dark") {
      initialIsDark = true;
    } else if (storedTheme === "light") {
      initialIsDark = false;
    } else {
      initialIsDark = prefersDark;
    }

    setIsDark(initialIsDark);
  }, []);


  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return [isDark, setIsDark] as const;
}

/*

"use client"

import { useState, useEffect } from "react"

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
  })

  useEffect(() => {
    const root = window.document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light")
    }
  }, [isDark]);
  
  return [isDark, setIsDark] as const;
}


Pasos opcionales para que persista:
- Crear un contexto y su provider.
- Englobar la aplicación con el provider.
- Utilizar el contexto.

*/