# Start Up Guide

## Getting Started

To run this application:

```bash
bun install
bunx --bun run start
```

## Building For Production

To build this application for production:

```bash
bunx --bun run build
```

### Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
bunx --bun run test
```

### Linting & Formatting

This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
bunx --bun run lint
bunx --bun run format
bunx --bun run fix
```
