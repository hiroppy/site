# Claude Code Skills

This directory contains project-specific Claude Code skills for the hiroppy/site repository.

## Available Skills

### init-article

Initialize new blog articles with interactive prompts.

**Usage**: `/init-article`

**What it does**:

- Prompts for article metadata (title, description, tags, image, references)
- Auto-generates slug from title (handles Japanese/English)
- Validates slug uniqueness
- Creates MDX file with proper frontmatter
- Provides next steps for writing

**Location**: `.claude/skills/init-article/SKILL.md`

**Examples**:

```
/init-article
```

Claude will guide you through:

1. Title input (Japanese or English)
2. Slug generation and confirmation
3. Description (1-2 sentences)
4. Tags (comma-separated, e.g., `node.js,typescript`)
5. Image path (e.g., `/images/brands/nodejs.png`)
6. Optional reference URLs

The skill creates a new MDX file at `src/content/blog/{slug}.mdx` with proper frontmatter and a starter template.

## Creating New Skills

To add a new skill to this project:

1. Create a new directory: `.claude/skills/{skill-name}/`
2. Add a `SKILL.md` file with YAML frontmatter and instructions
3. Document the skill in this README
4. Update `CLAUDE.md` if the skill adds new commands or workflows

See the [Claude Code Skills documentation](https://code.claude.com/docs/en/skills) for more information.
