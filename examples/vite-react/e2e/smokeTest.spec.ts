import { test, expect } from '@playwright/test';

test('it renders all SVGs as expected', async ({ page }) => {
  await page.goto('/');
  const images = await page.getByRole('img').all();

  expect.soft(images.length).toBe(10);

  for (const [index, image] of images.entries()) {
    await expect(image).toHaveScreenshot(`svg-${index}.png`);
  }
});
