import { test } from '@playwright/test';
import fs from 'fs'
import path from 'path'

const downloadDir = path.join(__dirname, '../html');

test('Go crawl each landchg results', async ({ page }) => {
  await page.goto('https://landchg.tcd.gov.tw/Module/RWD/Web/pub_exhibit.aspx')
  await page.waitForLoadState('networkidle')

  const yearOptions = await page.$$('select[name="ProjectYear"] option')
  const cityOptions = await page.$$('select[name="City"] option')

  let years = await Promise.all(yearOptions.map(async (option) => {
    return await option.evaluate((node) => node.getAttribute('value'))
  }))
  years = years.filter(year => year !== '-1')

  let cities = await Promise.all(cityOptions.map(async (option) => {
    return await option.evaluate((node) => node.getAttribute('value'))
  }))
  cities = cities.filter(city => city !== '-1')

  console.log(years, cities)

  // then loop through each year and cities
  // and save the html source down
  for (const year of years) {
    for (const city of cities) {
      const filename = `${year}-${city}.html`
      const filepath = path.join(downloadDir, filename)

      if (fs.existsSync(filepath)) {
        continue
      }

      await page.selectOption('select[name="ProjectYear"]', year)
      await page.selectOption('select[name="City"]', city)

      await page.waitForLoadState('networkidle')
      console.log(`crawl ${year}-${city}`)

      // await page.waitForTimeout(5000)
      await page.innerHTML('html', { timeout: 0 }).then((html) => {
        fs.writeFileSync(filepath, html)
      })
    }
  }
})
