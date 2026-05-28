import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.js",
  output: {
    file: "dist/index.js",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    nodeResolve({
      preferBuiltins: true,
      exportConditions: ["import", "require", "node", "default"],
    }),
    commonjs(),
  ],
};
