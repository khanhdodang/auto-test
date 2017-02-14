# auto-test
Automation testing script using ES6, Babel 6, Mocha and Istanbul

## How to use
+ Go to https://portal.kobiton.com
+ Select any device & choose language NodeJS
+ Copy `webdriverKobitonServerConfig` and replace it on 4 test files
  + test-android-web.js
  + test-ios-web.js
  + test-android-app.js
  + test-ios-app.js
+ Modify `desiredCaps` that match with online devices


## Commands
```
npm install
npm test
npm run test-android-web
npm run test-ios-web
npm run test-android-app
npm run test-ios-app
```
