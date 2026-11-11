@AGENTS.md

## Claude Code

- The `lamba-tv-app` skill (`.claude/skills/lamba-tv-app/`) has the patterns for TV pages, phone pages, settings and
  review. Use it for any work on the app.
- The Lamba MCP server is set up in `.mcp.json` as `lamba`, with the key from the `LAMBA_KEY` environment variable.
  If its tools are missing, ask the developer to make a key at https://lamba.tv/devs/keys and start Claude Code with
  `LAMBA_KEY` set, or to run the `claude mcp add` command on https://lamba.tv/devs/docs/ai/. Never ask them to paste
  the key into the chat.
