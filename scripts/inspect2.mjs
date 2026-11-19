import { chromium } from 'playwright-core'

const executablePath = `${process.env.HOME}/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome`
const browser = await chromium.launch({
  executablePath,
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
})

async function open(viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
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
await page.screenshot({ path: '/tmp/opencode/p2-day.png' })

await page.evaluate(() => window.__scene.getState().setMode('night'))
await page.waitForTimeout(4000)
await page.screenshot({ path: '/tmp/opencode/p2-night.png' })

await page.evaluate(() => window.__scene.getState().setMode('day'))
await page.waitForTimeout(3000)

await page.evaluate(() =>
  window.__scene.getState().flyTo([0, 34, 0.02], [0, 0.2, 0], 0.01),
)
await page.waitForTimeout(2000)
await page.screenshot({ path: '/tmp/opencode/p2-top.png' })

const views = [
  ['tanah-lot', [0.05, 1.15, 4.75], [0.85, 0.22, 3.28]],
  ['ubud', [2.15, 1.5, 2.35], [3.35, 0.3, 1.12]],
  ['kelingking', [5.9, 1.55, 6.55], [7.25, 0.4, 5.55]],
  ['batur', [4.05, 2.1, -2.1], [5.11, 1.0, -3.26]],
  ['uluwatu', [0.1, 1.5, 7.75], [1.12, 0.55, 6.82]],
]

for (const [name, position, target] of views) {
  await page.evaluate(
    ([p, t]) => window.__scene.getState().flyTo(p, t, 0.01),
    [position, target],
  )
  await page.waitForTimeout(1800)
  await page.screenshot({ path: `/tmp/opencode/p2-${name}.png` })
}

const mobile = await open({ width: 390, height: 844 })
await mobile.screenshot({ path: '/tmp/opencode/p2-mobile.png' })

await browser.close()
