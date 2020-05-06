import 'babel-polyfill'
import 'colors'
import BPromise from 'bluebird'
import wd from 'wd'
import {assert} from 'chai'

const kobitonEnv = process.env.ENV || 'test'
const host = process.env.HOST || 'api-test.kobiton.com'
const username = process.env.USERNAME || 'khanhdo'
const apiKey = process.env.APIKEY || ''

let webdriverKobitonServerConfig = {
  protocol: 'http:',
  host,
  auth: `${username}:${apiKey}`
}

const desiredCaps = {
  sessionName:        'Automation testing session',
  sessionDescription: 'This is an example for Android app testing',
  deviceOrientation:  'portrait',
  captureScreenshots: true,
  app:                'http://appium.github.io/appium/assets/ApiDemos-debug.apk',
  deviceGroup:        'KOBITON',
  deviceName:         '*',
  platformName:       'Android',
  fullReset: true
}

let driver

describe('Automation Test on Android app', () => {

  before(async () => {
    driver = wd.promiseChainRemote(webdriverKobitonServerConfig)
    driver.on('status', (info) => {console.log(info.cyan)})
    driver.on('command', (meth, path, data) => {
      console.log(' > ' + meth.yellow, path.grey, data || '')
    })
    driver.on('http', (meth, path, data) => {
      console.log(' > ' + meth.magenta, path, (data || '').grey)
    })
    try {
      await driver.init(desiredCaps)
    }
    catch (err) {
      if (err.data) {
        console.error(`init driver: ${err}`)
      }
    throw err
    }
  })

  it('should run test successfully on Android native app', async () => {
    await driver
    .elementByXPath("//android.widget.TextView[@content-desc='App']")
    .sleep(2)
    .click()
    .elementByXPath("//android.widget.TextView[@content-desc='Activity']")
    .click()
    .flick(0, -700, 200)
    .flick(0, -700, 200)
    .elementByXPath("//android.widget.TextView[@content-desc='Soft Input Modes']")
    .click()
    .elementById('saved')
    .click()
    .clear()
    .hideKeyboard()
    .currentContext()
    .contexts()
    .context('NATIVE_APP')
    .elementByClassName('android.widget.TextView')
    .elementByClassNameOrNull('android.widget.TextView')
    .element('xpath', "//android.widget.TextView[@content-desc='Resize mode:']").then((ele) => {
      driver
      .isEnabled(ele)
      .isSelected(ele)
      .getAttribute(ele)
    })
    .elements('xpath', '//android.widget.TextView')
    .saveScreenshot('native_android_screenshot.png')
    .back()
    .back()
    .back()
    .elementByXPath("//*[@content-desc='Accessibility']").text()
    .waitForElementByXPath("//*[@content-desc='Accessibility']")
    .click()
    .back()
    .hasElementById('list')
    .elementById('list')
    .flick(0, -700, 200)
    .elementById('list')
    .flick(300, 700, 200)
    .getWindowSize()
    .elementByXPath("//*[@content-desc='Accessibility']")
    .type('Tab')
    .back()
    .back()
    .elementByXPath("//android.widget.TextView[@content-desc='Animation']")
    .click()
    .elementByXPath("//android.widget.TextView[@content-desc='Bouncing Balls']")
    .click()
    .elementById('container')
    .flick(getRandomInt(1, 1000), getRandomInt(-200, 200), getRandomInt(100, 1000))
    .sleep(5)
    .flick(getRandomInt(-200, 200), getRandomInt(-1000, 0), getRandomInt(100, 1000))
    .back()
    .back()
    .getOrientation()
    .setOrientation('PORTRAIT')
    .setOrientation('LANDSCAPE')
    .setOrientation('PORTRAIT')
  })

  after(async () => {
    if (driver != null) {
      try {
        await driver.quit()
      }
      catch (err) {
        console.error(`quit driver: ${err}`)
      }
    }
  })

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
})
