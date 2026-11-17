"use client";

import { useState } from "react";

type OwnerLoginProps = {
  expectedPin: string;
  onUnlock: () => void;
  onClose: () => void;
};

export function OwnerLogin({ expectedPin, onUnlock, onClose }: OwnerLoginProps) {
  const [error, setError] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const pin = String(new FormData(event.currentTarget).get("pin") ?? "").trim();
    if (pin === expectedPin || expectedPin === "") {
      onUnlock();
      return;
    }
    setError(true);
  };

  return (
    <div
      className="owner-login-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form className="owner-login-card" onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="owner-login-title">
        <button type="button" className="owner-login-close" aria-label="Закрыть" onClick={onClose}>
          ×
        </button>
        <small>Доступ владельца</small>
        <h2 id="owner-login-title">Вход в кабинет</h2>
        <p>Введите PIN-код кабинета. Клиентская запись доступна без входа.</p>
        <label>
          PIN-код
          <input
            type="password"
            inputMode="numeric"
            name="pin"
            autoComplete="current-password"
            required
            maxLength={12}
            placeholder="Введите код"
            onChange={() => setError(false)}
          />
        </label>
        {error && (
          <span className="owner-login-error" role="alert">
            Неверный PIN-код. Попробуйте ещё раз.
          </span>
        )}
        <button type="submit" className="owner-login-submit">
          Войти в кабинет
        </button>
        <span className="owner-login-demo">
          Демо-доступ: PIN из переменной OWNER_PIN. Перед публикацией замените его на серверную авторизацию.
        </span>
      </form>
    </div>
  );
}
