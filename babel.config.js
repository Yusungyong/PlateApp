module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        "moduleName": "@env",
        "path": ".env",
        "blocklist": null,
        "allowlist": null,
        "safe": false,
        "allowUndefined": true,
        "verbose": false
      }
    ],
    'react-native-reanimated/plugin'   // 반드시 plugins 배열의 마지막!
  ]
};
