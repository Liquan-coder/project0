module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel", // 👈 關鍵：它必須放在 presets 裡面！
    ],
  };
};