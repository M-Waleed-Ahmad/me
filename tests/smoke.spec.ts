import { expect, test, type Page } from '@playwright/test';

const ROUTES = [
  '/',
  '/products',
  '/products/deepshield',
  '/products/wepsych',
  '/products/arabia-hills',
  '/products/alfa-club',
  '/products/other',
  '/journey',
  '/journey/axelliant',
  '/process',
  '/explorer',
  '/contact',
];

/** Load a page and wait for hydration, for tests that interact with client components. */
async function gotoReady(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
}

/** Collect console errors and uncaught exceptions (hydration mismatches show up here). */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

for (const route of ROUTES) {
  test(`${route} renders cleanly`, async ({ page }) => {
    const errors = trackErrors(page);
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page).toHaveTitle(/Waleed Ahmad/);

    // Let client components hydrate and effects settle before judging the console.
    await page.waitForLoadState('networkidle');
    expect(errors, errors.join('\n')).toEqual([]);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, 'page should not scroll horizontally').toBeLessThanOrEqual(1);
  });
}

test('every page has its own title, canonical URL and share image', async ({ page }) => {
  const seen = new Set<string>();
  for (const route of ROUTES) {
    await page.goto(route);
    const title = await page.title();
    expect(seen.has(title), `duplicate title "${title}" on ${route}`).toBe(false);
    seen.add(title);
    const canonical = route === '/' ? /^https?:\/\/[^/]+\/?$/ : new RegExp(`${route}$`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/opengraph-image/);
  }
});

test('homepage map intro plays on landing and can be skipped', async ({ page }) => {
  await page.goto('/');
  const root = page.locator('html');
  await expect(root).not.toHaveAttribute('data-intro', 'skip');
  await page.keyboard.press('Escape');
  await expect(root).toHaveAttribute('data-intro', 'skip');
  // Landing anywhere else never plays it.
  const other = await page.context().newPage();
  await other.goto('/products');
  await expect(other.locator('html')).toHaveAttribute('data-intro', 'skip');
});

test('contact and résumé are reachable from the header', async ({ page, isMobile }) => {
  await gotoReady(page, '/products');
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'Contact' })).toBeVisible();
  } else {
    await expect(page.getByRole('banner').getByRole('link', { name: 'Contact' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'Résumé' })).toBeVisible();
  }
  const pdf = await page.request.get('/Waleed_Ahmad_CV.pdf');
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()['content-type']).toContain('application/pdf');
});

test('search opens with the keyboard and navigates', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard shortcut is a desktop affordance');
  await page.goto('/products');
  // The shortcut is handled by client code, so wait until the page has hydrated.
  await page.waitForLoadState('networkidle');
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'Search the site' });
  await expect(dialog).toBeVisible();
  const input = dialog.getByRole('textbox', { name: 'Search' });
  await expect(input).toBeFocused();
  await input.fill('wepsych');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/products\/wepsych$/);
});

test('DeepShield band explorer responds to the slider', async ({ page }) => {
  await gotoReady(page, '/products/deepshield');
  const slider = page.getByRole('slider', { name: 'Model score' });
  await slider.fill('0.2');
  await expect(page.getByText('Reported as likely authentic.')).toBeVisible();
  await slider.fill('0.95');
  await expect(page.getByText(/High-confidence manipulation/)).toBeVisible();
});

test('explorer draws edges and re-centres on click', async ({ page }) => {
  const errors = trackErrors(page);
  await gotoReady(page, '/explorer');
  const graph = page.locator('figure svg').first();
  await expect(graph.locator('line').first()).toBeAttached();
  // Graph nodes are keyboard-operable; this also avoids clicking the gap between circle and label.
  await page.getByRole('button', { name: 'Focus on Python' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 2, name: 'Python' })).toBeVisible();
  expect(errors, errors.join('\n')).toEqual([]);
});

test('unknown routes get the notebook 404', async ({ page }) => {
  const response = await page.goto('/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('in the notebook');
});

test('home map opens a project summary and links to its page', async ({ page }) => {
  await gotoReady(page, '/');
  await page.getByRole('button', { name: 'Open WePsych' }).focus();
  await page.keyboard.press('Enter');
  const open = page.getByRole('link', { name: 'Open project' });
  await expect(open).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(open).toBeHidden();
});

test('datasheet questions open from a deep link', async ({ page }) => {
  await page.goto('/products/wepsych#hardest-tradeoff');
  await expect(page.locator('details#hardest-tradeoff')).toHaveAttribute('open', '');
  await expect(page.getByText('Shared sessions, per-person reflections')).toBeVisible();
});

test('retired pages redirect to their new homes', async ({ page }) => {
  await page.goto('/systems');
  await expect(page).toHaveURL(/\/journey\/axelliant$/);
  await page.goto('/intelligence');
  await expect(page).toHaveURL(/\/products\/deepshield$/);
});

test('earlier site versions can be viewed and switched back', async ({ page }) => {
  await gotoReady(page, '/process');
  await page.getByRole('button', { name: /Emerald on black/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-version', 'v1');
  await page.goto('/journey');
  await expect(page.locator('html')).toHaveAttribute('data-version', 'v1');
  await page.getByRole('button', { name: 'Back to now' }).click();
  await expect(page.locator('html')).not.toHaveAttribute('data-version', /.+/);
});
