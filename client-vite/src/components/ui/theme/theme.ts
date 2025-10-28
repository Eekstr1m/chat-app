import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        primary: { value: "#b24c63" },
        skeleton: { DEFAULT: { value: "#773343" }, 100: { value: "#4b202a" } },
      },
    },
  },
});
