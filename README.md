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

## Data-driven booking tests

The booking tests use a data file so that new scenarios can be added without writing new test code. The file lives at `tests/data/bookings.ts` and contains two lists:

- `validBookings` holds complete bookings. Each entry has a `name` used in the test report and a `payload` that is sent to `POST /booking`. The spec creates each booking, checks the response, and then fetches it to confirm the stored data matches.
- `incompleteBookings` holds bookings with required fields missing. These are used to check how the API rejects bad input.

To add a valid case, add a new object to `validBookings` with a unique `name` and a full `payload`. The spec in `tests/booking-data-driven.spec.ts` picks it up automatically on the next run.

To add an incomplete case, add an object to `incompleteBookings`. The spec in `tests/booking-negative.spec.ts` sends the payload and expects a 500 status.

The 500 expectation reflects how the Restful Booker API currently behaves, not how a well-designed API should respond. A standard API would normally return 400 for invalid input. The test name states this so a reviewer can see the choice was deliberate, and it would need updating if the API's behavior changes.

Authorization is covered in `tests/booking-auth.spec.ts`, which confirms that an update without a token returns 403.

To run only the data-driven and negative tests, use:

```bash
npx playwright test tests/booking-data-driven.spec.ts tests/booking-negative.spec.ts
```

## Test Coverage

- Booking API: retrieves booking IDs, creates bookings, and verifies retrieved booking data.
- Response validation: checks status codes, content type, required fields, and response value types.
- Authentication: verifies that updates without a token are rejected and that authenticated updates succeed.
- Negative cases: checks the API’s observed behavior for incomplete booking data.
- Data-driven tests: exercises multiple booking payloads.
- PokeAPI practice tests: checks successful responses, response values, Pokémon types, and a not-found response.
- Authenticated deletion: deletes a booking and verifies it can no longer be retrieved.
