#syntax=docker/dockerfile:1.19@sha256:b6afd42430b15f2d2a4c5a02b919e98a525b785b1aaff16747d2f623364e39b6 

# This file is responsible for building the apps locally, and running playwright
# on them. Used primarily to update Linux snapshots (matching the GitHub Actions
# runners) on other OSes and architectures. This matches what we do in
# .github/worfklows/playwright.yaml, but locally.
FROM node:22.14@sha256:e5ddf893cc6aeab0e5126e4edae35aa43893e2836d1d246140167ccc2616f5d7 AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Work like in a CI environment
ENV CI=true

COPY . /app
WORKDIR /app

RUN corepack enable
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

RUN pnpm --recursive build

# All our tests run in chromium (the new headless mode), so no need for other
# browsers or the outdated chromium headless shell
RUN pnpm exec playwright install --with-deps chromium --no-shell

# Ready to run!