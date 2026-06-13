import { expect, type Page, test } from "@playwright/test";
import { setupPage } from "./utils/setupPage";

test.describe("Contact form", () => {
  test("uses a pointer cursor on the contact button", async ({ page }) => {
    await setupPage(page, "http://localhost:3000/");

    await expect(
      page.getByRole("button", { name: "お問い合わせ" }).first(),
    ).toHaveCSS("cursor", "pointer");
  });

  test("opens the contact modal and submits to the contact form route", async ({
    page,
  }) => {
    const requests: string[] = [];

    await page.route("**/form", async (route) => {
      requests.push(route.request().postData() ?? "");

      await route.fulfill({
        status: 200,
        body: "OK",
      });
    });

    await setupPage(page, "http://localhost:3000/");

    const dialog = await openAndFillContactForm(page);
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

  test("keeps submit disabled without submitting invalid data", async ({
    page,
  }) => {
    const requests: string[] = [];

    await page.route("**/form", async (route) => {
      requests.push(route.request().postData() ?? "");

      await route.fulfill({
        status: 200,
        body: "OK",
      });
    });

    await setupPage(page, "http://localhost:3000/");

    await page.getByRole("button", { name: "お問い合わせ" }).first().click();

    const dialog = page.getByRole("dialog", { name: "お問い合わせ" });
    await dialog.getByLabel(/会社名/).fill("Example Inc.");
    await dialog.getByLabel(/連絡先メールアドレス/).fill("not-an-email");
    await dialog.getByLabel(/技術相談/).check();
    await dialog
      .getByLabel(/依頼の内容/)
      .fill("Next.js のパフォーマンス改善について相談したいです。");

    await expect(dialog.getByRole("button", { name: "送信" })).toBeDisabled();
    expect(requests).toHaveLength(0);
  });

  test("disables submit until all required fields are filled", async ({
    page,
  }) => {
    await setupPage(page, "http://localhost:3000/");

    await page.getByRole("button", { name: "お問い合わせ" }).first().click();

    const dialog = page.getByRole("dialog", { name: "お問い合わせ" });
    const submitButton = dialog.getByRole("button", { name: "送信" });

    await expect(dialog.getByLabel(/技術相談/)).toBeVisible();
    await expect(dialog.getByLabel(/開発支援依頼/)).toBeVisible();
    await expect(dialog.getByLabel(/登壇・執筆依頼/)).toBeVisible();
    await expect(dialog.getByLabel(/その他/)).toBeVisible();
    await expect(dialog.getByLabel(/技術顧問依頼/)).toHaveCount(0);
    await expect(dialog.locator("legend", { hasText: "依頼の種類" })).toHaveCSS(
      "margin-bottom",
      "12px",
    );
    await expect(submitButton).toBeDisabled();
    await expect(submitButton).toHaveCSS("opacity", "0.5");

    await dialog.getByLabel(/会社名/).fill("Example Inc.");
    await expect(submitButton).toBeDisabled();

    await dialog.getByLabel(/連絡先メールアドレス/).fill("not-an-email");
    await expect(submitButton).toBeDisabled();

    await dialog.getByLabel(/技術相談/).check();
    await expect(submitButton).toBeDisabled();

    await dialog
      .getByLabel(/依頼の内容/)
      .fill("Next.js のパフォーマンス改善について相談したいです。");
    await expect(submitButton).toBeDisabled();

    await dialog.getByLabel(/連絡先メールアドレス/).fill("contact@example.com");
    await expect(submitButton).toBeEnabled();
  });

  test("shows a red sales warning when selecting other request type", async ({
    page,
  }) => {
    await setupPage(page, "http://localhost:3000/");

    await page.getByRole("button", { name: "お問い合わせ" }).first().click();

    const dialog = page.getByRole("dialog", { name: "お問い合わせ" });
    await dialog.getByLabel(/その他/).check();

    const warning = dialog.getByText(
      "営業のお問い合わせは固くお断りしております。",
    );
    await expect(warning).toBeVisible();
    await expect(warning).toHaveClass(/text-red-600/);
  });

  test("shows the sales rejection message when the form route returns 400", async ({
    page,
  }) => {
    await page.route("**/form", async (route) => {
      await route.fulfill({
        status: 400,
        body: "Bad Request",
      });
    });

    await setupPage(page, "http://localhost:3000/");

    const dialog = await openAndFillContactForm(page);
    await dialog.getByRole("button", { name: "送信" }).click();

    await expect(dialog.getByRole("alert")).toContainText(
      "営業のお問い合わせと判断されたため送信できませんでした",
    );
  });

  test("shows the error message when the form route fails", async ({
    page,
  }) => {
    await page.route("**/form", async (route) => {
      await route.fulfill({
        status: 500,
        body: "Internal Server Error",
      });
    });

    await setupPage(page, "http://localhost:3000/");

    const dialog = await openAndFillContactForm(page);
    await dialog.getByRole("button", { name: "送信" }).click();

    await expect(dialog.getByRole("alert")).toContainText("送信に失敗しました");
  });

  test("keeps the contact modal open when clicking outside the panel", async ({
    page,
  }) => {
    await setupPage(page, "http://localhost:3000/");

    await page.getByRole("button", { name: "お問い合わせ" }).first().click();

    const dialog = page.getByRole("dialog", { name: "お問い合わせ" });
    await expect(dialog).toBeVisible();

    await page.mouse.click(16, 16);

    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "Close dialog" }).click();
    await expect(dialog).not.toBeVisible();
  });
});

async function openAndFillContactForm(page: Page) {
  await page.getByRole("button", { name: "お問い合わせ" }).first().click();

  const dialog = page.getByRole("dialog", { name: "お問い合わせ" });
  await expect(dialog).toBeVisible();

  await dialog.getByLabel(/会社名/).fill("Example Inc.");
  await dialog.getByLabel(/連絡先メールアドレス/).fill("contact@example.com");
  await dialog.getByLabel(/技術相談/).check();
  await dialog
    .getByLabel(/依頼の内容/)
    .fill("Next.js のパフォーマンス改善について相談したいです。");

  return dialog;
}
