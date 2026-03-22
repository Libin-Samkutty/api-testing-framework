# API Testing Framework

A structured, TypeScript-based API testing framework built on [Playwright](https://playwright.dev/). It targets two public APIs - [ReqRes](https://reqres.in) and [RealWorld (Conduit)](https://realworld-docs.netlify.app/docs/intro) - and includes schema validation, test data factories, mock server support, and CI/CD workflows.

---

## Table of Contents

- [What is Playwright (for API testing)?](#what-is-playwright-for-api-testing)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Practical CLI Reference](#practical-cli-reference)
- [Viewing Reports](#viewing-reports)
- [Project Architecture](#project-architecture)
- [Key Concepts](#key-concepts)
- [Coverage Map](#coverage-map)
- [CI/CD](#cicd)
- [Troubleshooting](#troubleshooting)
- [Useful Links](#useful-links)

---

## What is Playwright (for API testing)?

Most people know [Playwright](https://playwright.dev/) as a browser automation tool, but it also has a powerful **API testing** mode that lets you send HTTP requests, assert on responses, and validate payloads - all without launching a browser.

In this project, Playwright is used **purely for API testing**. Instead of clicking buttons, we call REST endpoints and verify their behaviour.

Key advantages over alternatives like Jest + Axios:
- Built-in retry logic and configurable timeouts
- Native TypeScript support with zero extra config
- Test parallelism out of the box
- Rich HTML reports with full request/response details
- Same toolchain for API and UI tests if you ever need both

---

## Project Structure

```
api-testing-framework/
├── package.json                  # Dependencies and npm scripts
├── tsconfig.json                 # TypeScript compiler config
├── playwright.config.ts          # Playwright projects, timeouts, reporters
├── .env.example                  # Template for environment variables
├── .gitignore
├── README.md
│
├── .github/workflows/
│   ├── ci.yml                    # Runs on every push / PR
│   └── nightly.yml               # Scheduled full-suite run
│
├── src/
│   ├── config/
│   │   └── environment.ts        # Reads and exports env variables
│   ├── types/
│   │   ├── reqres.types.ts       # TypeScript interfaces for ReqRes API shapes
│   │   └── realworld.types.ts    # TypeScript interfaces for RealWorld API shapes
│   ├── clients/
│   │   └── api-client.ts         # Thin wrapper around Playwright's APIRequestContext
│   ├── services/
│   │   ├── reqres/
│   │   │   ├── auth.service.ts   # Login / register calls to ReqRes
│   │   │   └── user.service.ts   # User CRUD calls to ReqRes
│   │   └── realworld/
│   │       ├── auth.service.ts   # Login / register calls to RealWorld
│   │       ├── article.service.ts
│   │       ├── comment.service.ts
│   │       └── profile.service.ts
│   ├── schemas/
│   │   ├── reqres/               # JSON Schema definitions for ReqRes responses
│   │   └── realworld/            # JSON Schema definitions for RealWorld responses
│   ├── factories/
│   │   ├── user.factory.ts       # Generates fake user data (powered by Faker)
│   │   └── article.factory.ts    # Generates fake article data
│   ├── validators/
│   │   └── schema-validator.ts   # AJV-based JSON Schema validator
│   ├── mocks/
│   │   ├── mock-server.ts        # Lightweight mock HTTP server setup
│   │   └── handlers/
│   │       ├── payment.handler.ts
│   │       └── notification.handler.ts
│   └── utils/
│       ├── logger.ts             # Structured console logger
│       └── helpers.ts            # Shared utility functions
│
└── tests/
    ├── fixtures/
    │   └── api.fixture.ts        # Playwright fixtures - shared setup / teardown
    ├── reqres/
    │   ├── auth.spec.ts          # Login and registration tests
    │   ├── users.spec.ts         # User list, get, create, update, delete
    │   └── schema-contracts.spec.ts  # JSON Schema contract tests
    ├── realworld/
    │   ├── auth.spec.ts
    │   ├── articles.spec.ts
    │   ├── comments.spec.ts
    │   ├── data-consistency.spec.ts
    │   ├── schema-contracts.spec.ts
    │   └── workflows.spec.ts     # End-to-end API workflow tests
    └── mocks/
        └── service-mocking.spec.ts
```

---

## Prerequisites

| Tool | Minimum version | How to check |
|------|----------------|--------------|
| [Node.js](https://nodejs.org/) | 18 (LTS recommended) | `node -v` |
| npm | 9 | `npm -v` |
| Git | any | `git --version` |

You do **not** need to install Playwright globally - it is pulled in as a project dependency via npm.

---

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd api-testing-framework
```

### 2. Install dependencies

```bash
npm install
```

This installs everything in `package.json`: Playwright, TypeScript, AJV (schema validator), Faker, and dotenv.

> **Note for Windows users:** If you see a warning about Playwright trying to download browser binaries, that is expected. This project uses Playwright in API-only mode so no browser is needed. You can safely ignore the warning, or prevent the download entirely by running `set PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 && npm install` before installing.

### 3. Set up environment variables

```bash
# macOS / Linux
cp .env.example .env

# Windows (Command Prompt)
copy .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

The defaults in `.env.example` point to the live public APIs and work without any changes for most tests.

---

## Configuration

### Environment variables (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `REQRES_BASE_URL` | `https://reqres.in` | Base URL for the ReqRes API |
| `REALWORLD_BASE_URL` | `https://api.realworld.io/api` | Base URL for the RealWorld API |
| `MOCK_SERVER_PORT` | `9090` | Port for the local mock server |
| `LOG_LEVEL` | `info` | Logging verbosity: `debug`, `info`, `warn`, or `error` |

### Playwright projects (`playwright.config.ts`)

The config defines three **projects**, each targeting a different set of tests:

| Project | Test files matched | Base URL used |
|---------|--------------------|---------------|
| `reqres-api` | `tests/reqres/**` | ReqRes |
| `realworld-api` | `tests/realworld/**` | RealWorld |
| `mock-scenarios` | `tests/mocks/**` | Local mock server |

Tests run with **1 worker by default** (serial) to avoid overwhelming the live RealWorld API. In CI, workers are capped at 2 and failed tests are retried up to 2 times automatically. You can override the worker count at any time with `--workers=N` on the command line.

---

## Running Tests

All commands are run from the project root.

### Run the full suite

```bash
npm test
```

### Run a specific project

```bash
npm run test:reqres        # ReqRes tests only (fast, good for CI)
npm run test:realworld     # RealWorld tests only (deep validation)
npm run test:mocks         # Mock scenario tests only
```

### Run a specific file

```bash
npx playwright test tests/reqres/auth.spec.ts
```

### Run tests matching a name or keyword

```bash
npx playwright test --grep "login"
npx playwright test --grep "schema"
```

### Control the number of parallel workers

By default the suite runs with **1 worker** (serial execution). This is intentional - the live RealWorld API can return intermittent errors when too many parallel requests arrive at once.

To override, pass `--workers` on the command line:

```bash
# Run with 4 workers (faster, but may cause flaky failures on live APIs)
npx playwright test --workers=4

# Run with 2 workers (a reasonable balance)
npx playwright test --workers=2

# Enforce serial execution explicitly
npx playwright test --workers=1
```

You can also target only the mock tests with multiple workers safely, since those use a local server with no rate limits:

```bash
npx playwright test --project=mock-scenarios --workers=4
```

> **Note:** If you see unexpected `401` or `404` errors only when running with multiple workers, reduce the worker count. The RealWorld public API does not have documented rate limits but is sensitive to concurrent registrations and mutations.

### Open the interactive Playwright UI

```bash
npx playwright test --ui
```

This opens a visual test runner where you can see each test, run them individually, and inspect request/response details - great for debugging.

### Type-check without running tests

```bash
npm run lint
```

---

## Practical CLI Reference

Day-to-day Playwright commands beyond `npm test`. All commands are run from the project root.

---

### Rerun only failed tests

After a run that had failures, replay just those tests without re-running everything:

```bash
npx playwright test --last-failed
```

Playwright remembers which tests failed (stored in `.playwright-last-run.json`) and runs only them on the next invocation. Useful when fixing a bug — iterate quickly without waiting for the full suite.

---

### Run a specific test by line number

Point directly at a test inside a file using `filename:linenumber`:

```bash
npx playwright test tests/realworld/auth.spec.ts:16
```

This runs the single test that starts on line 16. Faster than filtering by name when you know exactly which test you want.

---

### Filter tests by name (and invert the filter)

```bash
# Run only tests whose name contains "schema"
npx playwright test --grep "schema"

# Run everything EXCEPT tests whose name contains "schema"
npx playwright test --grep-invert "schema"

# Combine: run schema tests in the reqres project only
npx playwright test --project=reqres-api --grep "schema"
```

---

### List all tests without running them

Dry-run to see every test name and file — no requests are made:

```bash
npx playwright test --list
```

Output includes the test title, file path, and which Playwright project it belongs to. Good for auditing coverage or finding a test name before using `--grep`.

---

### Retry flaky tests on the command line

Override the `retries` value from `playwright.config.ts` for a single run:

```bash
# Retry each failing test up to 3 times before marking it failed
npx playwright test --retries=3
```

Use this on CI or when the live API is having a bad day and you want to push through transient errors without changing the config file.

---

### Stop after the first N failures

Fail fast instead of running the entire suite when something is clearly broken:

```bash
# Stop after the first failure
npx playwright test --max-failures=1

# Stop after 5 failures
npx playwright test --max-failures=5
```

Useful in CI to get fast feedback on a broken build rather than waiting for all tests to finish.

---

### Override the timeout

```bash
# Give each test 60 seconds instead of the default 30 s
npx playwright test --timeout=60000
```

Useful when running against a slow staging environment or when debugging network latency issues. Value is in milliseconds.

---

### Repeat each test N times

Find flaky tests by running each test multiple times in the same session:

```bash
# Run every test 5 times
npx playwright test --repeat-each=5

# Target just the auth tests for flakiness analysis
npx playwright test tests/realworld/auth.spec.ts --repeat-each=10
```

A test that passes 10/10 is stable. One that fails 2/10 is flaky and needs investigation.

---

### Shard the suite across machines

Split the total test count into equal slices so multiple CI machines run in parallel:

```bash
# Machine 1 of 3
npx playwright test --shard=1/3

# Machine 2 of 3
npx playwright test --shard=2/3

# Machine 3 of 3
npx playwright test --shard=3/3
```

Each shard runs an independent subset of tests. When all three machines finish, merge the reports (see below).

---

### Merge reports from multiple shards

After a sharded run, each shard writes its own report blob to a directory. Merge them into a single HTML report:

```bash
# Step 1: run shards, each writing blobs to a shared folder
npx playwright test --shard=1/3 --reporter=blob --reporter-output-dir=blob-reports
npx playwright test --shard=2/3 --reporter=blob --reporter-output-dir=blob-reports
npx playwright test --shard=3/3 --reporter=blob --reporter-output-dir=blob-reports

# Step 2: merge all blobs into one HTML report
npx playwright merge-reports --reporter=html blob-reports
```

The merged HTML report behaves identically to a normal single-run report — every test, its status, duration, and failure details are included in one place.

---

### Choose a different reporter at runtime

Override the reporters defined in `playwright.config.ts` for a single run:

```bash
# Minimal dot output (one dot per test)
npx playwright test --reporter=dot

# Verbose line-per-test output
npx playwright test --reporter=list

# JSON output to a custom file
npx playwright test --reporter=json --output=my-results.json

# Multiple reporters at once
npx playwright test --reporter=list,html
```

| Reporter | Best for |
|----------|----------|
| `list` | Local development — detailed, readable |
| `dot` | CI pipelines — compact, low noise |
| `html` | Sharing results — visual, filterable |
| `json` | Post-processing — machine-readable |
| `blob` | Shard merging — raw data for `merge-reports` |

---

### Debug a single test

Drop into Playwright's step-by-step debugger for a specific test:

```bash
npx playwright test tests/realworld/auth.spec.ts:16 --debug
```

The debugger pauses before each action. You can inspect variables, step forward, and see exactly what request is about to be made. For API tests this is particularly useful for inspecting request headers and response bodies mid-test.

---

### Update the `.env` inline (without editing the file)

Pass environment variables directly on the command line for a one-off run:

```bash
# macOS / Linux
REALWORLD_BASE_URL=https://staging.example.com/api npx playwright test

# Windows (PowerShell)
$env:REALWORLD_BASE_URL="https://staging.example.com/api"; npx playwright test

# Windows (Command Prompt)
set REALWORLD_BASE_URL=https://staging.example.com/api && npx playwright test
```

This lets you point the suite at a staging or local backend without touching `.env`.

---

## Viewing Reports

After any test run, an HTML report is written to `reports/html/` and a JSON report to `reports/results.json`.

To open the HTML report:

```bash
npm run report
```

This opens your browser to a page showing every test with its status, duration, request details, and any failure messages.

---

## Project Architecture

### How a request flows through the framework

```
Test file (*.spec.ts)
  └── receives a Fixture (api.fixture.ts)     - shared setup, e.g. authenticated context
        └── calls a Service (*.service.ts)    - encapsulates calls for one resource/domain
              └── uses the API Client (api-client.ts)  - thin wrapper over Playwright request
                    └── HTTP request to the API

Response is then:
  ├── Status code asserted (e.g. expect(res.status()).toBe(200))
  ├── Body validated against a JSON Schema (schema-validator.ts + AJV)
  └── Specific fields checked (e.g. expect(body.user.email).toBe(...))
```

### Fixtures

Playwright [fixtures](https://playwright.dev/docs/test-fixtures) are how you share setup and teardown logic across tests without repeating yourself. `api.fixture.ts` extends Playwright's base fixtures to inject pre-configured service instances and authenticated request contexts into tests automatically.

```typescript
// Without fixtures - repetitive:
test('list articles', async ({ request }) => {
  const token = await login(request);   // repeated in every test
  const res = await request.get('/articles', { headers: { Authorization: `Token ${token}` } });
  // ...
});

// With fixtures - clean:
test('list articles', async ({ articleService }) => {
  const res = await articleService.list();   // auth handled by the fixture
  // ...
});
```

### Services

Service classes group all HTTP calls for a resource in one place. Tests call service methods rather than building raw requests. This keeps tests readable and means changing an endpoint URL or header only needs to happen in one file.

### Factories

Factories use [@faker-js/faker](https://fakerjs.dev/) to generate realistic, randomised test data on every run. This prevents tests from depending on hard-coded values and makes each run independent.

```typescript
// user.factory.ts generates data like:
{
  username: "johnsmith42",
  email: "johnsmith42@example.com",
  password: "Xk#9mP2q"
}
```

### Schema validation

[AJV](https://ajv.js.org/) validates API responses against [JSON Schema](https://json-schema.org/) definitions in `src/schemas/`. Contract tests send a real request and check the response shape matches the schema - catching silent breaking changes in the API before they cause downstream failures.

---

## Key Concepts

### What is a "fixture"?

A fixture is a reusable piece of setup/teardown that Playwright injects into your tests automatically based on the parameter name. Think of it as a smarter `beforeEach` that only runs when a test actually needs it.

### What is JSON Schema / contract testing?

A [JSON Schema](https://json-schema.org/learn/getting-started-step-by-step) describes the expected shape of a JSON object - which fields must exist, their types, and any constraints. Contract tests verify that the API response matches this schema. If the API changes a field name or type, the contract test fails immediately, even if the values look plausible.

### What is a mock server?

The `src/mocks/` directory contains a lightweight HTTP server that simulates third-party services (e.g. a payment gateway or notification provider). Mock tests run entirely locally with no external network calls, making them fast and reliable for testing integration logic in isolation.

---

## Coverage Map

| Area | ReqRes | RealWorld |
|------|--------|-----------|
| Auth / validation | Login, register, error cases | JWT lifecycle, 401/422 checks |
| Schema contracts | All endpoints | Articles, comments, users |
| Data consistency | Response structure | Cascading deletes, persistence |
| Workflows | - | Multi-user, full CRUD flows |
| Service mocking | Fallback data source | Payment / notification mocks |

---

## CI/CD

### `ci.yml` - every push and pull request

- Installs Node and project dependencies
- Runs the `reqres-api` project (fast, deterministic)
- Uploads the JSON report as a build artifact

### `nightly.yml` - scheduled at 03:00 UTC

- Runs the full `realworld-api` suite
- Generates and uploads the HTML report

For **private repositories**, add any required values (e.g. custom `REALWORLD_BASE_URL`) as GitHub secrets: Settings → Secrets and Variables → Actions → New repository secret.

---

## Troubleshooting

### `Cannot find module` after install

Delete `node_modules` and reinstall:

```bash
# macOS / Linux
rm -rf node_modules && npm install

# Windows (PowerShell)
Remove-Item -Recurse -Force node_modules; npm install
```

### Tests fail with `net::ERR_NAME_NOT_RESOLVED`

The test cannot reach the API URL. Check:
1. Your `.env` file has the correct `REQRES_BASE_URL` / `REALWORLD_BASE_URL`.
2. You have a working internet connection.
3. The public API is not down (check [reqres.in](https://reqres.in) in your browser).

### TypeScript errors on `npm run lint`

Ensure Node 18+ is installed. Run `npm install` again to make sure all `@types/*` packages are present.

### `EADDRINUSE: address already in use :::9090`

Port `9090` is taken by another process. Either stop that process or change `MOCK_SERVER_PORT` in your `.env` to a free port (e.g. `9091`).

### HTML report not opening

Run `npm run report` explicitly after tests complete, or open `reports/html/index.html` directly in your browser.

---

## Useful Links

| Resource | URL |
|----------|-----|
| Playwright - API testing guide | https://playwright.dev/docs/api-testing |
| Playwright - fixtures | https://playwright.dev/docs/test-fixtures |
| Playwright - configuration | https://playwright.dev/docs/test-configuration |
| ReqRes API reference | https://reqres.in |
| RealWorld API specification | https://realworld-docs.netlify.app/docs/specs/backend-specs/introduction |
| AJV JSON Schema validator | https://ajv.js.org/ |
| JSON Schema - getting started | https://json-schema.org/learn/getting-started-step-by-step |
| Faker.js - generating test data | https://fakerjs.dev/guide/ |
| TypeScript handbook | https://www.typescriptlang.org/docs/handbook/intro.html |
| dotenv - environment variables | https://github.com/motdotla/dotenv#readme |
