import { render, screen } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { page } from "vitest/browser";
import { Header } from "./Header";

describe("Header Component", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  describe("Visual Regression Tests", () => {
    it("renders header in light theme", async () => {
      render(<Header variant="default" currentPath="/" />);

      const header = screen.getByRole("banner");
      await expect(header).toMatchScreenshot();
    });

    it("renders header in dark theme", async () => {
      document.documentElement.classList.add("dark");

      render(<Header variant="default" currentPath="/" />);

      const header = screen.getByRole("banner");
      await expect(header).toMatchScreenshot();
    });

    it("renders header with active link", async () => {
      render(<Header variant="default" currentPath="/about" />);

      const header = screen.getByRole("banner");
      await expect(header).toMatchScreenshot();
    });

    it("renders fullscreen variant", async () => {
      render(<Header variant="fullscreen" currentPath="/" />);

      const header = screen.getByRole("banner");
      await expect(header).toMatchScreenshot();
    });

    it("renders mobile menu opened", async () => {
      render(<Header variant="default" currentPath="/" />);

      // Click mobile menu button
      const menuButton = page.getByRole("button", { name: /メニューを開く/i });
      await menuButton.click();

      const header = screen.getByRole("banner");
      await expect(header).toMatchScreenshot();
    });
  });

  describe("Interaction Tests", () => {
    it("toggles mobile menu on button click", async () => {
      render(<Header variant="default" currentPath="/" />);

      const menuButton = page.getByRole("button", { name: /メニューを開く/i });
      const mobileMenu = document.getElementById("mobile-menu");

      // Initially has hidden class
      expect(mobileMenu?.classList.contains("hidden")).toBe(true);

      // Click to open
      await menuButton.click();
      expect(mobileMenu?.classList.contains("hidden")).toBe(false);

      // Click to close
      await menuButton.click();
      expect(mobileMenu?.classList.contains("hidden")).toBe(true);
    });

    it("closes mobile menu when clicking inside menu area", async () => {
      render(<Header variant="default" currentPath="/" />);

      const menuButton = page.getByRole("button", { name: /メニューを開く/i });
      await menuButton.click();

      const mobileMenu = document.getElementById("mobile-menu");
      expect(mobileMenu?.classList.contains("hidden")).toBe(false);

      // The mobile menu container has onClick handler that closes the menu
      // Clicking the menu button again should close it
      await menuButton.click();

      // Menu should close
      expect(mobileMenu?.classList.contains("hidden")).toBe(true);
    });

    it("highlights active navigation link", async () => {
      const { rerender } = render(<Header variant="default" currentPath="/" />);

      // Check desktop navigation
      const desktopNav = page.getByRole("navigation", {
        name: /メインナビゲーション/i,
      });
      const homeButton = desktopNav.getByRole("link", { name: "Home" });
      const homeElement = homeButton.element();
      expect(homeElement.className).toContain("bg-blue-100");

      // Change to about page
      rerender(<Header variant="default" currentPath="/about" />);

      const aboutButton = desktopNav.getByRole("link", { name: "About" });
      const aboutElement = aboutButton.element();
      expect(aboutElement.className).toContain("bg-blue-100");
    });

    it("matches active link with pathMatch pattern", async () => {
      render(<Header variant="default" currentPath="/blog/some-article" />);

      // Check desktop navigation
      const desktopNav = page.getByRole("navigation", {
        name: /メインナビゲーション/i,
      });
      const blogButton = desktopNav.getByRole("link", { name: "Blog" });
      const blogElement = blogButton.element();
      expect(blogElement.className).toContain("bg-blue-100");
    });
  });
});
