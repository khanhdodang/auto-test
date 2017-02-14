import 'babel-polyfill'
import 'colors'
import BPromise from 'bluebird'
import wd from 'wd'
import {assert} from 'chai'

const webdriverKobitonServerConfig = {
  host: 'api.kobiton.com',
  auth: '',
  port: 80
}

const desiredCaps = {
  sessionName:        'Automation testing session',
  sessionDescription: 'This is an example for Android web testing',
  deviceOrientation:  'portrait',
  captureScreenshots: true,
  browserName:        'chrome',
  deviceGroup:        'KOBITON',
  deviceName:         'Galaxy S6',
  platformName:       'Android'
}

const testUrl = 'http://the-internet.herokuapp.com/login'
let driver
const waitingTime = 3000

const wrongUsernameMsg = 'Your username is invalid!'
const wrongPasswordMsg = 'Your password is invalid!'
const successMsg = 'You logged into a secure area!'

describe('Automation Test on Android web', () => {

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

  it('should return error when we input wrong username', async () => {
    await driver.get(`${testUrl}`)
    .waitForElementById('username')
    .sendKeys('foo')
    .waitForElementById('password')
    .sendKeys('SuperSecretPassword!')
    .waitForElementByXPath("//form[@name='login']")
    .submit()
    await BPromise.delay(waitingTime)
    let msg = await driver.waitForElementByXPath("//div[@id='flash']").text()
    assert.include(msg, wrongUsernameMsg)
  })

  it('should return error when we input wrong password', async () => {
    await driver.get(`${testUrl}`)
    .waitForElementById('username')
    .sendKeys('tomsmith')
    .waitForElementById('password')
    .sendKeys('SuperSecretPassword')
    .waitForElementByXPath("//form[@name='login']")
    .submit()
    await BPromise.delay(waitingTime)
    let msg = await driver.waitForElementByXPath("//div[@id='flash']").text()
    assert.include(msg, wrongPasswordMsg)
  })

  it('should run test successfully with correct username and password', async () => {
    await driver.get(`${testUrl}`)
    .waitForElementById('username')
    .sendKeys('tomsmith')
    .waitForElementById('password')
    .sendKeys('SuperSecretPassword!')
    .waitForElementByXPath("//form[@name='login']")
    .submit()
    await BPromise.delay(waitingTime)
    let msg = await driver.waitForElementByXPath("//div[@id='flash']").text()
    assert.include(msg, successMsg)
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
