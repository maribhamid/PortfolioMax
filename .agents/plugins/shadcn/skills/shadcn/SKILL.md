---
name: shadcn
description: Guidance on using the shadcn MCP tools to search components, inspect registry code, fetch examples, and add UI components.
---

# shadcn MCP Integration

This skill outlines how to interact with the shadcn MCP server and CLI to discover, inspect, and install UI components.

## Available MCP Tools

The shadcn MCP server exposes the following tools:

- `search_items_in_registries`: Search for components across configured registries with fuzzy matching.
- `list_items_in_registries`: List items by type (`ui`, `component`, `block`, `hook`, etc.).
- `view_items_in_registries`: View raw component code, imports, and definitions directly from the registry.
- `get_item_examples_from_registries`: Retrieve full demo and example implementations (e.g., `card-demo`, `dialog-demo`).
- `get_add_command_for_items`: Obtain the exact CLI command to add specified items to your project.
- `get_audit_checklist`: Post-generation checklist to verify component integration and consistency.

## Usage Workflow

1. **Search or Browse**:
   Use `search_items_in_registries` with a query (e.g., "data table" or "button") to find available primitives.
2. **Review Examples**:
   Call `get_item_examples_from_registries` to view idiomatic patterns and prop usage.
3. **Inspect Code**:
   Inspect specific component files using `view_items_in_registries`.
4. **Install Component**:
   Run `npx shadcn@latest add <component>` or use the command from `get_add_command_for_items`.
