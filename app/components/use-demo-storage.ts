"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Сливает сохранённые данные с текущими умолчаниями.
 * Это защищает от старого localStorage: когда в объект добавляются новые поля
 * (например, mapUrl или directions), они не остаются undefined и не роняют рендер.
 */
function mergeWithDefaults<T>(stored: unknown, initial: T): T {
  if (Array.isArray(initial)) {
    return (Array.isArray(stored) ? stored : initial) as T;
  }
  if (initial && typeof initial === "object" && stored && typeof stored === "object" && !Array.isArray(stored)) {
    const storedObject = stored as Record<string, unknown>;
    const definedStored = Object.fromEntries(Object.entries(storedObject).filter(([, value]) => value !== undefined));
    return { ...(initial as object), ...definedStored } as T;
  }
  return (stored ?? initial) as T;
}

/**
 * Состояние демо с сохранением в localStorage.
 * Пока нет базы данных, это единственный способ не терять правки владельца при перезагрузке.
 *
 * Сервер и первый клиентский рендер отдают initial (гидрация без расхождений),
 * а сохранённые данные подставляются в микротаске после монтирования.
 * Любой доступ к localStorage обёрнут в try/catch: в приватном окне, при запрете
 * хранилища или битых данных страница обязана остаться рабочей.
 */
export function useLocalDraft<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const hydrated = useRef(false);

  useEffect(() => {
    hydrated.current = true;
    window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(key);
        if (stored) setValue(mergeWithDefaults<T>(JSON.parse(stored), initial));
      } catch {
        // Нет доступа или невалидный JSON — работаем на демо-значениях.
      }
    }, 0);
    // initial нужен только как набор умолчаний для первого чтения.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback<React.Dispatch<React.SetStateAction<T>>>(
    (next) => {
      setValue((current) => {
        const resolved = typeof next === "function" ? (next as (previous: T) => T)(current) : next;
        if (hydrated.current) {
          try {
            window.localStorage.setItem(key, JSON.stringify(resolved));
          } catch {
            // Переполнение хранилища не должно ломать интерфейс.
          }
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update] as const;
}
