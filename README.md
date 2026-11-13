# Booking API Tests

Booking API tests

![Playwright tests](https://github.com/januaryn/api-test-portfolio/actions/workflows/playwright.yml/badge.svg)

## Project description

This repository is an API test automation portfolio for a booking service. It uses Playwright's API testing support with TypeScript to verify HTTP endpoints for status codes, response bodies, headers, authentication, and negative cases. Tests run locally and in GitHub Actions on every push.

## Coverage

- **Endpoints covered:** booking-roundtrip.spec.ts, helpers, booking.spec.ts [list the endpoints and HTTP methods you test, e.g. GET, POST, PUT, PATCH, DELETE]
- **Test cases:** 2 [number] across positive, negative, and data-driven scenarios
- **Status codes verified:** 200, 201, 400, 401, 403, 404, 500
- **Response body:** values, types, and schema
- **Headers and authentication**
- **Negative and edge cases**
- **Resilience:** requests that receive a 503 are retried by the `postWithRetry` helper (see Design notes)

## Tech stack

- Playwright (API testing)
- TypeScript
- Node.js 18+
- GitHub Actions (CI)

## Prerequisites

- Node.js 18 or later
- npm (included with Node.js)
- Git

## Setup

```bash
git clone https://github.com/januaryn/api-test-portfolio.git
cd api-test-portfolio
npm ci
npx playwright install --with-deps

## Running the tests

```bash
Run the full suiteRun the full suite with npx playwright test

Run a single file with npx playwright test tests/booking-roundtrip.spec.ts.

Open the HTML report after a run with npx playwright show-report.
```

## Project structure

```
api-test-portfolio/
├── .github/
│   └── workflows/
│       └── playwright.ymlapi-test-portfolio/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── tests/
│   ├── helpers/
│   │   └── retry.ts
│   ├── booking.spec.ts
│   └── booking-roundtrip.spec.ts
├── playwright.config.ts
├── package.json
└── README.md
  # CI pipeline (job: booking-api-tests)
├── tests/
│   ├── helpers/
│   │   └── retry.ts         # postWithRetry helper
│   └── *.spec.ts             # API test suites
├── playwright.config.ts      # Playwright configuration
├── package.json
└── README.md
```

## CI pipeline

The workflow in `.github/workflows/playwright.yml` runs on push and pull request. It contains one job, `booking-api-tests` (display name: "Booking API tests"), which installs dependencies, installs Playwright browsers, runs the suite, and uploads the report as an artifact.

## Design notes

- **Retry on 503:** The `postWithRetry` helper in `tests/helpers/retry.ts` retries a request up to 3 times with a 2000 ms delay between attempts, but only on 503 responses. Other failures fail immediately, so real bugs are not hidden by retries.
- **Modular tests:** Shared request and assertion logic lives in helpers, keeping spec files focused on behavior.
- **Data-driven tests:** Scenarios are parameterized so that new cases are added as data rather than new code.
- **CI labels:** The job ID and display name are set explicitly so the status badge and run history are easy to read during review.
