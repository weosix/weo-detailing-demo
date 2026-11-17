import type { NextConfig } from "next";

/**
 * Дев-сервер по умолчанию блокирует загрузку клиентских ресурсов с других хостов.
 * Без этого списка телефон (192.168.0.115) получает HTML, но JavaScript не загружается —
 * страница выглядит рабочей, а кнопки не реагируют.
 */
const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.0.115"],
};

export default nextConfig;
