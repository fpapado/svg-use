# Contributing

You are more than welcome to contribute to the tools here!

As a starter, you can:

1. [File an issue in this repository](/issues) with your ideas, bugs or
   suggestions. Please let the contributors know if you start working on a
   long-term project. It is hard to coordinate different efforts, if we are
   unaware of them.
1. If there is enough consensus for the work, or the work is sufficiently small,
   you are ready to start working on it!
1. [Fork the repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)
   to your own repository
1. Follow the
   [setting up a development environment instructions](#setting-up-a-development-environment)
1. Make your changes
1. [Create a Pull Request (PR) from your fork to this repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)
1. Go through PR review(s) with the maintainers
1. Eventually, merge the contribution :tada:

## Setting up a development environment

### Step 1: Get Node.js

We recommend to
[use `nvm` for managing your Node.js version](https://github.com/nvm-sh/nvm). We
recommend following
[the deeper shell integration section, to ensure that nvm is invoked automatically per directory](https://github.com/nvm-sh/nvm?tab=readme-ov-file#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file).

```sh
nvm install
nvm use
```

This ensures that you will always be using the node version that is specified in
the repository's `.nvmrc` file.

### Step 2: Install pnpm

We use [`pnpm`](https://pnpm.io/) for package management.

We recommend that you
[install `pnpm` via `corepack`, which is node's built-in way of managing package managers](https://pnpm.io/installation#using-corepack):

```shell
corepack enable
```

This ensures that your `pnpm` version will be in sync with the one specified in
the repository's `package.json` `packageManager` field.

### Step 3: Install and Run Tests

```shell
# install dependencies for all packages
pnpm install

# run tests for all packages
pnpm test
```

You are set up! Follow
["Linking local packages to your application"](#linking-local-packages-to-an-application),
for how to develop against an existing application.

## Linking local packages to an application

While developing library packages, it is useful to develop them locally, and
link them against a target application.

"Linking", in this case, means using a locally-built version as a dependency in
another application.

This section uses the following example:

- The relevant package is `@svg-use/core`
- The source repository path is `/Users/user/svg-use`
- The target application path is `/Users/user/my-app`

### Using the `file:` protocol

We recommend that you use the `file:` protocol to link the dependency to the
target application.

[The `file:` protocol ensures that peer dependencies are resolved according to the target application's `node_modules`](https://pnpm.io/cli/link#whats-the-difference-between-pnpm-link-and-using-the-file-protocol),
which is critical especially for `react`, which requires the same version across
an application.

The `file:` protocol is available in `pnpm`, `yarn` and `npm`.

In your target application `package.json`, add:

```json
{
  "dependencies": {
    "@svg-use/core": "file:/Users/user/svg-use/packages/core"
  }
}
```

Finally, install dependencies in the **target** application:

```shell
pnpm install
```

You are set up! Any changes you make to the relevant package will be reflected
to the target application (after building the relevant package). You only need
to link the package once.

#### Developing and re-building

Most of the time, when developing the relevant package, you would run a watcher
that re-builds it automatically.

In the **source** repository, run the `dev` command for the relevant package,
and its dependencies:

```shell
pnpm --filter "core..." run dev
```

(Note that `--filter "core..."` is
[pnpm's syntax for running a command in a workspace package, as well as its dependencies](https://pnpm.io/filtering))

#### One-off builds

You can alternatively run a production build for the relevant package and its
dependencies:

```shell
pnpm --filter "core..." run build
```

## Updating snapshots

When you make a feature addition or change, Playwright end-to-end tests might
fail due to outdated snapshots.

You should update snapshots in your PR, by running a command locally on your
machine. We have automated this process, but note that you will need Docker, in
order to update snapshots targetting Linux Chromium.

From the monorepo root, run:

```shell
pnpm test:e2e:update-snapshots
```

After a few minutes, snapshots should be written in their respective
directories. Simply commit and push!
