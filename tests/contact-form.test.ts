import { expect, test } from "@playwright/test";
import { setupPage } from "./utils/setupPage";

test.describe("Contact form", () => {
  test("opens the contact modal and submits to the coder-penguin form endpoint", async ({
    page,
  }) => {
    const requests: string[] = [];

    await page.route("https://coder-penguin.com/form", async (route) => {
      requests.push(route.request().postData() ?? "");

      await route.fulfill({
        status: 200,
        body: "OK",
      });
    });

    await setupPage(page, "http://localhost:3000/");

    await page.getByRole("button", { name: "お問い合わせ" }).first().click();

    const dialog = page.getByRole("dialog", { name: "お問い合わせ" });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel(/会社名/).fill("Example Inc.");
    await dialog.getByLabel(/連絡先メールアドレス/).fill("contact@example.com");
    await dialog.getByLabel(/技術相談/).check();
    await dialog
      .getByLabel(/依頼の内容/)
      .fill("Next.js のパフォーマンス改善について相談したいです。");

    await dialog.getByRole("button", { name: "送信" }).click();

    await expect(dialog.getByRole("status")).toContainText(
      "お問い合わせが送信されました",
    );
    expect(requests).toHaveLength(1);
    expect(requests[0]).toContain('name="email"');
    expect(requests[0]).toContain("contact@example.com");
    expect(requests[0]).toContain('name="company"');
    expect(requests[0]).toContain("Example Inc.");
    expect(requests[0]).toContain('name="content"');
    expect(requests[0]).toContain("技術相談");
    expect(requests[0]).toContain('name="comment"');
    expect(requests[0]).toContain(
      "Next.js のパフォーマンス改善について相談したいです。",
    );
  });

  test("keeps required fields from submitting empty data", async ({ page }) => {
    const requests: string[] = [];

    await page.route("https://coder-penguin.com/form", async (route) => {
      requests.push(route.request().postData() ?? "");

      await route.fulfill({
        status: 200,
        body: "OK",
      });
    });

    await setupPage(page, "http://localhost:3000/");

    await page.getByRole("button", { name: "お問い合わせ" }).first().click();

    const dialog = page.getByRole("dialog", { name: "お問い合わせ" });
    await dialog.getByRole("button", { name: "送信" }).click();

    await expect(dialog.getByLabel(/会社名/)).toBeFocused();
    expect(requests).toHaveLength(0);
  });
});
