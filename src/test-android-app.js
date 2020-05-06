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

})
