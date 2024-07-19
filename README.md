# K6 Performance Testing Setup
Project created as part of wtw k6 task which sets up the performance test using the K6 framework with package management, Webpack bundling, advanced K6 scenarios and thresholds, and continuous integration with GitHub Actions.

## Setup

1. **Clone the repository**:
    git clone https://github.com/sushant9658/k6-task-wtw.git
    cd k6-task-wtw


2. **Install dependencies**:
    npm install


3. **Build the K6 script**:
    npm run build

4. **Run tests locally**:
    npm run test

## Continuous Integration

The CI pipeline is set up using GitHub Actions. The workflow file `.github/workflows/k6-test.yml` triggers the K6 tests on push and pull request events.

## Project Structure

- `src/test.js`: K6 test script
- `webpack.config.js`: Webpack configuration file
- `.github/workflows/k6-test.yml`: GitHub Actions workflow file
- `package.json`: Node.js project configuration
- `README.md`: Project documentation

## Advanced K6 Features

- **Multiple scenarios**: Simulates different user behaviors using `constant-vus` and `ramping-vus` executors.
- **Custom metrics and thresholds**: Includes custom metrics (`Rate`, `Counter`) and sets thresholds for these metrics.

## References



to run the test execute "npm run test"