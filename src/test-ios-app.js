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
  sessionDescription: 'This is an example for iOS app testing',
  deviceOrientation:  'portrait',
  captureScreenshots: true,
  app:                'https://s3.amazonaws.com/kobiton-dev/apps-test/UIKitCatalog-Test-Adhoc.ipa',
  deviceGroup:        'KOBITON',
  deviceName:         '*',
  platformName:       'iOS',
  browserName: '',
  fullReset: true
}

let driver

describe('Automation Test on iOS app', () => {

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

  it('should run test successfully on iOS native app', async () => {
    await driver
      .waitForElementByXPath('//*[@name="UIKitCatalog"]')
      .click()
      .saveScreenshot('native_ios_screenshot.png')
      .getOrientation()
      .setOrientation('PORTRAIT')
      .sleep(1000)
      .setOrientation('LANDSCAPE')
      .sleep(1000)
      .setOrientation('PORTRAIT')
      .execute('mobile: scroll', [{direction: 'down'}])
      .execute('mobile: scroll', [{direction: 'up'}])
      .element('xpath', '//UIAStaticText[@name="Activity Indicators"]').then((ele) => {
        driver
        .isEnabled(ele)
        .isSelected(ele)
        .getAttribute(ele)
      })
      .waitForElementByXPath('//UIAStaticText[@name="Activity Indicators"]')
      .back()
      .elementOrNull('xpath', '//UIAStaticTest')
      .waitForElementByName('Alert Controller')
      .click()
      .waitForElementByName('Text Entry')
      .click()
      .alertText()
      .acceptAlert()
      .waitForElementByName('Text Entry')
      .click()
      .dismissAlert()
      .back()
      .waitForElementByName('Buttons')
      .click()
      .waitForElementByName('X Button')
      .getSize()
      .back()
      .waitForElementByName('Date Picker')
      .click()
      .back()
      .waitForElementByName('Image View')
      .click()
      .back()
      .waitForElementByName('Page Control')
      .click()
      .back()
      .waitForElementByName('Picker View')
      .click()
      .back()
      .waitForElementByName('Progress Views')
      .click()
      .back()
      .waitForElementByName('Segmented Controls')
      .click()
      .back()
      .waitForElementByName('Sliders')
      .click()
      .back()
      .waitForElementByName('Stack Views')
      .click()
      .back()
      .waitForElementByName('Steppers')
      .click()
      .back()
      .execute('mobile: scroll', [{direction: 'down'}])
      .waitForElementByName('Switches')
      .click()
      .back()
      .waitForElementByName('Text Fields')
      .click()
      .waitForElementByClassName('UIATextField')
      .sendKeys('Kobiton')
      .text()
      .waitForElementByClassName('UIATextField')
      .clear()
      .hideKeyboard()
      .back()
      .waitForElementByName('Text View')
      .click()
      .back()
      .waitForElementByName('Web View')
      .click()
      .back()
      .execute('mobile: scroll', [{direction: 'down'}])
      .waitForElementByAccessibilityId('Search')
      .click()
      .back()
      .execute('mobile: scroll', [{direction: 'down'}])
      .waitForElementByAccessibilityId('Toolbars')
      .click()
      .back()
      .execute('mobile: scroll', [{direction: 'down'}])
      .waitForElementByName('Activity Indicators')
      .moveTo(200, 300)
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
