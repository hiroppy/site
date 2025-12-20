---
name: init-article
description: Initialize a new blog article with interactive prompts for title, description, tags, and image. Automatically generates slug from title and validates uniqueness.
version: 1.0.0
author: hiroppy/site
tags: [blog, mdx, content-creation, interactive]
---

# Blog Article Initializer

This skill guides you through creating a new blog article for the hiroppy/site project.

## What This Skill Does

1. Prompts for article metadata (title, description, tags, image, references)
2. Auto-generates a kebab-case slug from the title
3. Validates that the slug is unique (no existing article with same name)
4. Creates an MDX file at `src/content/blog/{slug}.mdx` with proper frontmatter
5. Provides next steps for writing the article

## Instructions for Claude

When this skill is invoked, follow these steps exactly:

### Step 1: Gather Information

Ask the user for the following information in order. Be patient and handle errors gracefully.

1. **Title** (required)
   - Prompt: "What is the article title? (Japanese or English)"
   - Validation: Must not be empty
   - If empty: Display error and re-prompt

2. **Auto-generate Slug**
   - Generate kebab-case slug from title using this algorithm:
     ```
     - Convert to lowercase
     - Remove Japanese characters (Hiragana \u3040-\u309F, Katakana \u30A0-\u30FF, Kanji \u4E00-\u9FFF)
     - Remove special characters except hyphens and alphanumeric
     - Replace spaces with hyphens
     - Remove consecutive hyphens
     - Trim hyphens from start/end
     ```
   - Display: "Generated slug: `{slug}` - Is this okay? (y/n)"
   - If slug is empty or very short (< 3 chars):
     - Display: "⚠️ Could not generate meaningful slug. Please enter a custom slug:"
   - If user says "n" or "no":
     - Prompt: "Enter custom slug (kebab-case, e.g., 'nextjs-app-router'):"
   - Validate custom slug is kebab-case format

3. **Description** (required)
   - Prompt: "Enter a 1-2 sentence description:"
   - Validation: Must not be empty
   - If empty: Display error and re-prompt

4. **Tags** (required)
   - Prompt: "Enter tags (comma-separated, no spaces):"
   - Example: "node.js,javascript,typescript"
   - Validation: Must be comma-separated (check for commas, no spaces around commas)
   - If invalid format:
     - Display: "❌ Error: Tags must be comma-separated with no spaces.\nExample: node.js,javascript,typescript"
     - Re-prompt

5. **Image Path** (required)
   - Display first:
     ```
     Available image directories:
       - /images/brands/ (Technology logos: nodejs.png, react.png, nextjs.png, typescript.png, etc.)
       - /images/blog/ (Custom blog images)
       - /images/meta/ (Meta images)
     ```
   - Prompt: "Enter OG image path (e.g., /images/brands/nodejs.png):"
   - Validation: Must start with `/images/`
   - If invalid:
     - Display: "❌ Error: Image path must start with /images/"
     - Re-prompt

6. **References** (optional)
   - Prompt: "Enter reference URLs (comma-separated, press Enter to skip):"
   - If user provides URLs:
     - Split by comma
     - Trim whitespace
     - Basic validation (starts with http:// or https://)
     - If invalid URL found: "⚠️ Warning: '{url}' doesn't appear to be valid. Continue anyway? (y/n)"

### Step 2: Validate Slug Uniqueness

Use the Read tool to check if file exists at:
`/Users/hiroppy/Programming/site/src/content/blog/{slug}.mdx`

If file exists:

- Display: "❌ Article with slug `{slug}` already exists!"
- Prompt: "Enter a different slug or type 'cancel' to abort:"
- If user enters new slug: Go back to Step 2 (validate again)
- If user types "cancel" or "c": Display "Cancelled. No file was created." and exit

### Step 3: Generate MDX Content

Create file content with this exact structure:

```mdx
---
title: "{title}"
date: {CURRENT_DATE_ISO_8601}
description: "{description}"
image: {image}
tags: {tags}
{if references array has items}
references:
{for each reference}
  - {reference}
{endfor}
{endif}
---

[関連リンクのタイトル](url)

{title} についての導入文を書きます。

## 背景

[背景や文脈を説明]

## [主要セクション1]

[内容を書く]

## まとめ

- 重要なポイント1
- 重要なポイント2
- 重要なポイント3
```

**Critical Requirements:**

- Date format MUST be ISO 8601: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Generate current date using JavaScript: `new Date().toISOString()`
- Example date: `2025-12-20T00:00:00.000Z`
- Tags are comma-separated string (NOT array)
- References are YAML array format if present
- All YAML strings with special characters should be quoted

### Step 4: Write File

Use the Write tool to create the file at:
`/Users/hiroppy/Programming/site/src/content/blog/{slug}.mdx`

Handle errors:

- If write fails due to permissions: Display clear error message
- If directory not found: Suggest user may not be in project root

### Step 5: Confirmation and Next Steps

Display success message with helpful next steps:

```
✅ Successfully created: src/content/blog/{slug}.mdx

📝 Next Steps:
1. Open the file and start writing
2. Refer to .claude/context/writing-style.md for comprehensive style guidelines
3. Pick 2-3 recent articles from src/content/blog/ to mimic writing style
4. Choose appropriate template for article type:
   - Technical Deep Dive: nodejs-strip-type.mdx, webpack-persistent-caching.mdx
   - Personal/Career: 30-years-old.mdx, join-yuimedi.mdx, 2023.mdx
   - Tutorial/How-To: create-feedle.mdx, nextjs-app-router-training.mdx
   - Event/Experience: first-speech-abroad.mdx, ireland.mdx
5. Run `pnpm fmt` before committing

🎨 Writing Tips (from writing-style.md):
- Use conversational but professional Japanese tone
- Start with context: "さて、" "今回は、" "最近、"
- Technical articles: 30-50% code ratio with detailed explanations
- Personal articles: Narrative flow with specific dates and gratitude
- Include self-references to related past articles using [title](url) syntax
- End with "さいごに" (personal) or "まとめ" (technical) section
- Be humble: "かなと思う" "気がする" "正直"

📚 Key Files:
- Style guide: .claude/context/writing-style.md
- Development: CLAUDE.md
- Type definitions: src/mdx/types.ts
- Content loader: src/mdx/contentLoader.ts
```

## Error Messages Reference

### Input Validation

- Empty title: `❌ Error: Title is required and cannot be empty.\nPlease enter a valid title:`
- Invalid tags: `❌ Error: Tags must be comma-separated with no spaces.\nExample: node.js,javascript,typescript\nPlease re-enter tags:`
- Invalid image: `❌ Error: Image path must start with /images/\nPlease enter a valid image path:`

### Slug Issues

- Empty slug: `⚠️  Could not generate meaningful slug from title.\nPlease enter a custom slug (kebab-case):`
- Duplicate slug: `❌ Article with slug '{slug}' already exists!\nEnter a different slug or type 'cancel' to abort:`

### File System

- Write error: `❌ Error: Cannot write to src/content/blog/\n{error message}\nPlease check permissions and try again.`

### User Cancellation

- Cancelled: `Cancelled. No file was created.`

## Examples

### Example 1: Technical Article (Mixed Language)

```
User: /init-article

Claude: What is the article title? (Japanese or English)
User: Node.jsでTypeScriptのコードを実行できるようになるかも

Claude: Generated slug: `nodejs-typescript` - Is this okay? (y/n)
User: y

Claude: Enter a 1-2 sentence description:
User: Node.jsでTypeScriptのコードを実行できるような機能が提案されました

Claude: Enter tags (comma-separated, no spaces):
User: node.js,typescript

Claude: Available image directories:
  - /images/brands/ (Technology logos)
  - /images/blog/ (Custom blog images)
  - /images/meta/ (Meta images)
Enter OG image path:
User: /images/brands/nodejs.png

Claude: Enter reference URLs (comma-separated, press Enter to skip):
User: https://github.com/nodejs/node/pull/53725

Claude: ✅ Successfully created: src/content/blog/nodejs-typescript.mdx
[... next steps ...]
```

### Example 2: Personal Article (Pure Japanese)

```
User: /init-article

Claude: What is the article title? (Japanese or English)
User: 30歳という節目の振り返り

Claude: Generated slug: `30` - Is this okay? (y/n)
User: n

Claude: Enter custom slug (kebab-case):
User: 30-years-reflection

Claude: Enter a 1-2 sentence description:
User: 30歳になったので、これまでの7年を振り返ります

Claude: Enter tags (comma-separated, no spaces):
User: life,ポエム

Claude: Available image directories: [...]
Enter OG image path:
User: /images/meta/profile.png

Claude: Enter reference URLs (comma-separated, press Enter to skip):
User: [press Enter]

Claude: ✅ Successfully created: src/content/blog/30-years-reflection.mdx
[... next steps ...]
```

### Example 3: Duplicate Detection

```
User: /init-article

Claude: What is the article title?
User: Secure Node.js

Claude: Generated slug: `secure-nodejs` - Is this okay?
User: y

Claude: ❌ Article with slug 'secure-nodejs' already exists!
Enter a different slug or type 'cancel' to abort:
User: secure-nodejs-2025

Claude: Enter a 1-2 sentence description:
[... continues ...]
```

## Technical Notes

- **Project root**: `/Users/hiroppy/Programming/site`
- **Blog directory**: `src/content/blog/`
- **File format**: `.mdx` (MDX with YAML frontmatter)
- **Naming convention**: kebab-case, no subdirectories
- **Content loader**: Dynamic import via `src/mdx/contentLoader.ts`
- **Frontmatter schema**: Defined in `src/mdx/types.ts`
- **Build system**: Next.js 16 with App Router, webpack mode
- **Language**: Primarily Japanese content with English technical terms

## Related Documentation

- [Writing Style Guide](.claude/context/writing-style.md) - Comprehensive style guidelines
- [Development Guidelines](../../CLAUDE.md) - Project setup and commands
- [Example Articles](../../src/content/blog/) - Reference implementations
