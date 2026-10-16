#!/usr/bin/env bash
# Installed on the droplet as /usr/local/bin/suuui-deploy (root-owned).
# CI reaches it through the deploy user's forced SSH command, so the only
# input it accepts is a full git commit SHA naming an image tag.
set -euo pipefail

tag="${1:-}"
if [[ ! "$tag" =~ ^[0-9a-f]{40}$ ]]; then
  echo "usage: suuui-deploy <40-char commit sha>" >&2
  exit 64
fi

exec 9>/run/lock/suuui-deploy.lock
flock -w 300 9

cd /opt/suuui
previous="$(sed -n 's/^IMAGE_TAG=//p' .env 2>/dev/null || true)"

export IMAGE_TAG="$tag"
docker compose pull --quiet app
if docker compose up -d --wait --wait-timeout 120; then
  printf 'IMAGE_TAG=%s\n' "$tag" > .env
  docker image prune -af >/dev/null
  echo "deployed $tag"
  exit 0
fi

echo "deploy of $tag did not become healthy" >&2
if [[ -n "$previous" ]]; then
  echo "rolling back to $previous" >&2
  IMAGE_TAG="$previous" docker compose up -d --wait --wait-timeout 120 || true
fi
exit 1
