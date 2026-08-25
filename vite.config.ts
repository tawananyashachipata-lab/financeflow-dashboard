import { defineConfig, type ConfigEnv, type PluginOption, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(async ({ mode }: ConfigEnv): Promise<UserConfig> => {
  const plugins: PluginOption[] = [tailwindcss()];

  const { tanstackStart } = await import("@tanstack/react-start/plugin/vite");
  plugins.push(
    tanstackStart({
      server: { entry: "server" },
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
    }),
  );
  plugins.push(react());

  if (mode === "development") {
    const { devtools } = await import("@tanstack/devtools-vite");
    plugins.unshift(
      devtools({
        logging: false,
        eventBusConfig: { enabled: false },
        enhancedLogs: { enabled: false },
        consolePiping: { enabled: false },
        removeDevtoolsOnBuild: false,
        injectSource: { enabled: true },
      }),
    );
  }

  return {
    resolve: { tsconfigPaths: true },
    plugins,
  };
});
