# Joao English Class

Project for notes from João's private English lessons.

## Structure

- `lessons/` — direct lesson summaries (no template)
- `vocabulary.md` — words learned

## Instructions for Claude

1. **Lessons:** create `lessons/aula-[number]-[date].md` with a direct summary. No template or forced structure.
2. **Vocabulary:** add new words to `vocabulary.md` as they are learned.
3. **Teaching:** use the `/teach` skill by default for teaching-related requests.

## Naming

- Lessons: `aula-01-28-07.md`, `aula-02-04-08.md`
- Keep them simple, with no filler and straight to the point.

## NotebookLM

All lessons are synchronized with one NotebookLM notebook: **"All Might English"** (ID: `f20883a9-bb2e-4db0-aa7b-9ab1e8f3f2d0`).

- Local files (`lessons/*.md`) are the source of truth and working copies.
- After creating or editing a lesson file, add it as a source in NotebookLM:
  ```
  notebooklm use f20883a9
  notebooklm source add lessons/aula-XX-DD-MM.md
  ```
- The CLI is installed with `uv tool install "notebooklm-py[browser]"`. Skill: `~/.agents/skills/notebooklm`.

### Using NotebookLM to Review Content

Personalized tutor configured to answer questions based on the lesson notes:

```
notebooklm use f20883a9
notebooklm ask "your question here"
```

Custom persona: a friendly tutor who cites the lesson notes, complements them with general knowledge, and points out learning patterns.
