@AGENTS.md

## Claude Code

- The `lamba-tv-app` skill (`.claude/skills/lamba-tv-app/`) has the patterns for screen pages, phone pages, settings and
  review. Use it for any work on the app.
- Connecting Lamba: follow "Connect Lamba, you lead" in AGENTS.md. You lead: offer it when a step needs it, run
  `claude mcp add --transport http lamba-tv https://lamba.tv/devs/mcp` yourself, and ask the developer to type `/mcp` and
  tap Allow. Never ask them to paste a key into the chat.