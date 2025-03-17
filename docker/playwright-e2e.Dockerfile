#syntax=docker/dockerfile:1.14@sha256:4c68376a702446fc3c79af22de146a148bc3367e73c25a5803d453b6b3f722fb 

# This file is responsible for building the apps locally, and running playwright
# on them. Used primarily to update Linux snapshots (matching the GitHub Actions
# runners) on other OSes and architectures. This matches what we do in
# .github/worfklows/playwright.yaml, but locally.
FROM node:22.14@sha256:f6b9c31ace05502dd98ef777aaa20464362435dcc5e312b0e213121dcf7d8b95 AS base

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