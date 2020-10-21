# 🏋️‍♂️ liquid.coach
Liquid.Coach will help you create and manage Elements transactions .  



## 🖥 Local Development

Below is a list of commands you will probably find useful.

### `yarn serve`

Runs the project in development/watch mode. Your project will be rebuilt upon changes. Error messages are pretty printed and formatted for compatibility VS Code's Problems tab. Your library will be rebuilt if you make edits.

### `yarn bundle`

Bundles the package to the `dist` folder.

### `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

### `yarn deploy`

Deploy to Github Pages pushing the `dist` directory to remote `gh-pages` branch 

### `docker build -t vulpemventures/liquid-coach:latest .`

Builds a Docker Container with the application

### `docker run --rm -p 7000:7000 --name coach vulpemventures/liquid-coach:latest`

Runs the Docker Container, serving liquid.coach at http://localhost:7000