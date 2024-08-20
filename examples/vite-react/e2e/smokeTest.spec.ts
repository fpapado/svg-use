import { test, expect } from '@playwright/test';

test('it renders all SVGs as expected', async ({ page }) => {
  await page.goto('/');
  const images = await page.getByRole('img').all();

  for (const image of images) {
    await expect(image).toHaveScreenshot();
  }
});
