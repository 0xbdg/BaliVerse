import { chromium } from 'playwright-core'

const executablePath = `${process.env.HOME}/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome`
const browser = await chromium.launch({
  executablePath,
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
})

async function open(viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
  page.setDefaultTimeout(90000)
  page.on('console', (message) => {
    if (message.type() === 'error') console.log('CONSOLE', message.text())
  })
  page.on('pageerror', (error) => console.log('PAGEERROR', error.message))
  await page.goto('http://localhost:5175/', { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => Boolean(window.__scene), null, { timeout: 90000 })
  await page.waitForTimeout(12000)
  return page
}

const page = await open({ width: 1440, height: 900 })
await page.screenshot({ path: '/tmp/opencode/p2c-day.png' })

await page.evaluate(() => window.__scene.getState().setMode('night'))
await page.waitForTimeout(4500)
await page.screenshot({ path: '/tmp/opencode/p2c-night.png' })

await page.evaluate(() =>
  window.__scene.getState().flyTo([0, 34, 0.02], [0, 0.2, 0], 0.01),
)
await page.waitForTimeout(2200)
await page.screenshot({ path: '/tmp/opencode/p2c-night-top.png' })

await page.evaluate(() =>
  window.__scene.getState().flyTo([-0.2, 1.15, 4.7], [0.55, 0.24, 3.25], 0.01),
)
await page.waitForTimeout(2000)
await page.screenshot({ path: '/tmp/opencode/p2c-night-tanah-lot.png' })

await page.evaluate(() => window.__scene.getState().setMode('day'))
await page.waitForTimeout(3000)

const views = [
  ['tanah-lot', [-0.2, 1.15, 4.7], [0.55, 0.24, 3.25]],
  ['ubud', [1.95, 1.9, 2.9], [3.35, 0.42, 1.12]],
  ['kelingking', [5.95, 1.35, 6.7], [7.25, 0.5, 5.55]],
  ['uluwatu', [0.05, 1.55, 7.85], [1.12, 0.6, 6.82]],
  ['batur', [3.9, 2.2, -2.0], [5.11, 1.0, -3.26]],
]

for (const [name, position, target] of views) {
  await page.evaluate(
    ([p, t]) => window.__scene.getState().flyTo(p, t, 0.01),
    [position, target],
  )
  await page.waitForTimeout(2000)
  await page.screenshot({ path: `/tmp/opencode/p2c-${name}.png` })
}

await page.close()

const mobile = await open({ width: 390, height: 844 })
await mobile.screenshot({ path: '/tmp/opencode/p2c-mobile.png' })
await mobile.close()

await browser.close()
