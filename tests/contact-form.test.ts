import { expect, type Page, test } from "@playwright/test";
import { setupPage } from "./utils/setupPage";

test.describe("Contact form", () => {
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

  test("shows zod validation errors without submitting empty data", async ({
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
    await dialog.getByRole("button", { name: "送信" }).click();

    await expect(dialog.getByText("会社名を入力してください")).toBeVisible();
    await expect(
      dialog.getByText("連絡先メールアドレスを入力してください"),
    ).toBeVisible();
    await expect(
      dialog.getByText("依頼の種類を選択してください"),
    ).toBeVisible();
    await expect(
      dialog.getByText("依頼の内容を入力してください"),
    ).toBeVisible();
    expect(requests).toHaveLength(0);
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
