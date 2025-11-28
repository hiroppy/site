import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

import "./src/global.css";

afterEach(() => {
  cleanup();
});
