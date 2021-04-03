import { Builder, By, until, Capabilities, WebDriver } from "selenium-webdriver";
const chromedriver = require('chromedriver')
const fs = require("fs");

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

// We need to make a normal class
class MyPage {
    // You should have a WebDriver in each of your page objects.
    driver: WebDriver
    // A url can be very helpful to store in your page object
    url: string
    // Constructor is just a key word, we'll have a method that is used when we create a new
    // MyPage instance.
    // The arguments we give will replace those certain parameters inside of our page object.
    homePage: By = By.className('logo top-nav__nhl-logo__img')
    privacyPolicy: By = By.xpath('//*[@id="homepage_index"]/section[2]/button/i')
    scores: By = By.xpath('//*[@id="homepage_index"]/div[1]/div/div/nav/div[4]/div/ul/li[2]/div/div/a/span')
    news: By = By.xpath('//*[@id="homepage_index"]/div[1]/div/div/nav/div[4]/div/ul/li[3]/div[1]/div/a/span')
    standings: By = By.xpath('//*[@id="homepage_index"]/div[1]/div/div/nav/div[4]/div/ul/li[5]/div/div/a/span')
    stats: By = By.xpath('//*[@id="homepage_index"]/div[1]/div/div/nav/div[4]/div/ul/li[6]/div[1]/div/a/span')
    statsByPlayer: By = By.xpath('//*[@id="root"]/header/nav/ul/li[2]/a')
    franchiseName : By = By.className('css-dvua67-singleValue')
    getStats: By = By.xpath('//*[@id="root"]/main/div[2]/button[1]')
    schedule: By = By.xpath('//*[@id="homepage_index"]/div[1]/div/div/nav/div[4]/div/ul/li[7]/div[1]/div/a')
    chosenGame: By = By.xpath('//*[@id="content-wrap"]/section/div[3]/div[1]/div/div[8]/table/tbody/tr[4]/td[5]/div/a/span[2]')
    players: By = By.xpath('//*[@id="homepage_index"]/div[1]/div/div/nav/div[4]/div/ul/li[8]/div[1]/div/a/span')
    teams: By = By.xpath('//*[@id="homepage_index"]/div[1]/div/div/nav/div[4]/div/ul/li[13]/div[1]/div/a/span')
    nyRangers: By = By.id('token-7921E84444AF680E5CFB4') 

    constructor(url?: string, driver?: WebDriver) {
        // In order to access the different properties in the object, you have to use
        // the keyword "this"
        if (url) this.url = url

        if (driver) this.driver = driver
        else // This else will not run if we give our constructor a driver
            this.getDriver()
    }
    getDriver() {
        if (this.driver)
            return this.driver
        else
            return new Builder().withCapabilities(Capabilities.chrome()).build()
    }
    async navigate() {
        await this.driver.get(this.url)
    }
    async sendKeys(elementBy: By, keys): Promise<void>  {
        await this.driver.wait(until.elementLocated(elementBy));
        return this.driver.findElement(elementBy).sendKeys(keys);
      }

    async takeScreenshot(filepath: string): Promise<void>  {
        fs.writeFile(
          `${filepath}.png`,
          await this.driver.takeScreenshot(),
          "base64",
          (e) => {
            if (e) console.log(e);
            else return filepath; //console.log("screenshot saved successfully");
          }
        );
      }

      async fileExists(path: string, exists: boolean) {
        if (fs.existsSync(path)) {
            // File exists in path
            exists = true;
            return exists;
        } else {
            // File doesn't exist in path
            exists = false;
            return exists;
        }
    };
}

const page = new MyPage('https://www.nhl.com/', driver)

test('Test 1: Go to the home and click on the x of the Privacy Policy', async () => {
    await page.navigate()
    await driver.manage().window().maximize()
    await (await driver.findElement(page.privacyPolicy)).click();
})

test('Test 2: Open the scores page', async () => {
    await page.navigate()
    await (await driver.findElement(page.scores)).click();
})    

test('Test 3: Go to News and then bo back to the home page', async () => {
    await page.navigate()
    await (await driver.findElement(page.news)).click();
    await (driver.sleep(5000));
    await (await driver.findElement(page.homePage)).click();
})

test('Test 4: Go to Standings and take a screenshot of the MassMutual East division', async () => {
    await page.navigate()
    await (await driver.findElement(page.standings)).click();
    await driver.wait(until.elementLocated(By.xpath('//span[text()="MassMutual East"]')));
    await (driver.sleep(5000));
    //and then we can take the screenshot
    await page.takeScreenshot("./files/screenshots/Standings");
    expect(await page.fileExists("./files/screenshots/Standings.png", true));  
})

test('Test 5: Go to Stats and then take a screenshot of the League Leaders', async () => {
    await page.navigate()
    await (await driver.findElement(page.stats)).click();
    await (driver.sleep(5000));
    //and then we can take the screenshot
    await page.takeScreenshot("./files/screenshots/LeagueLeaders.png");
    expect(await page.fileExists("./files/screenshots/LeagueLeaders.png", true));
})

test('Test 6: Go to Stats, check the stats of the New York Rangers, and then take a screenshot', async () => {
  await page.navigate()
    await (await driver.findElement(page.stats)).click();
    await (await driver.findElement(page.statsByPlayer)).click();
    await (driver.sleep(5000));
    await (await driver.findElement(By.xpath('(//input[@autocapitalize="none"])[4]'))).sendKeys('New York Rangers\n');
    await (await driver.findElement(page.getStats)).click();
    await (driver.sleep(5000));
    //We can take the screenshot
    await page.takeScreenshot("./files/screenshots/NYRangers_Stats.png");
    expect(await page.fileExists("./files/screenshots/NYRangers_Stats.png", true));
})

test('Test 7: Check the schedule and chose a game', async () => {
    await page.navigate()
    await (await driver.findElement(page.schedule)).click();
    await (driver.sleep(5000));
    await (await driver.findElement(page.chosenGame)).click();
})

test('Test 8: Go to Players, select Wayne Gretzky, and take a screenshot of him', async () => {
    await page.navigate()
    await (await driver.findElement(page.players)).click();
    await (driver.sleep(5000));
    await (await driver.findElement(By.xpath('//*[@id="searchTerm"]'))).sendKeys('Wayne Gretzky\n');
    await (driver.sleep(5000));
    await (await driver.findElement(By.css('[href="/player/wayne-gretzky-8447400"]'))).click();
    //We can take the screenshot
    await page.takeScreenshot("./files/screenshots/Gretzky.png");
    expect(await page.fileExists("./files/screenshots/Gretzky.png", true));
})

test('Test 9: Go to Teams and select the New York Rangers and it will go to the team page', async () => {
    await page.navigate()
    await driver.findElement(page.teams).click();
    await driver.sleep(5000);
    await driver.manage().window().maximize()
    var otherScreen = await (await driver).getAllWindowHandles()
    await driver.switchTo().window(otherScreen[1])
    await page.driver.wait(until.elementLocated(By.css('[href="/rangers/roster/"]')))
    await page.driver.findElement(By.css('[href="/rangers/roster/"]')).click();
    await driver.sleep(5000);
    await page.driver.findElement(By.css('[href="/player/alexis-lafreniere-8482109"]')).click();
    await driver.sleep(5000);
    await (await page.driver.findElement(By.css('[href="#career"]'))).click();
    //We can take the screenshot
    await page.takeScreenshot("./files/screenshots/Lafreniere.png");
    expect(await page.fileExists("./files/screenshots/Lafreniere.png", true));
    // We can a goal from Lafreniere
    await (await page.driver.findElement(By.css('[href="/rangers/video/lafreniere-buries-rebound/c-7928291"]'))).click();
    await driver.sleep(5000);
    await page.driver.quit()
})