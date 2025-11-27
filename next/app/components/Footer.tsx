const links = [
  { href: "https://github.com/hiroppy/", label: "GitHub" },
  { href: "https://x.com/about_hiroppy/", label: "Twitter" },
  { href: "https://www.linkedin.com/in/hiroppy/", label: "LinkedIn" },
  { href: "/blog/rss.xml", label: "RSS" },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white/80 py-6 text-sm text-gray-600">
      <div className="container mx-auto flex flex-col items-center gap-3 px-6 text-center md:flex-row md:justify-between">
        <span>© 2025 - Copyright Hiroppy, All Rights Reserved.</span>
        <div className="flex items-center gap-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-600 transition hover:text-blue-700"
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
