#!/bin/bash

branch=$(git symbolic-ref --short HEAD)
repo_url=$(git config --get remote.origin.url)

if [ -z "$repo_url" ]; then
  echo "No remote repository configured" >&2
  exit 1
fi

# Check if pull request already exists
if pr_url=$(gh pr view "$branch" --repo "$repo_url" --json url -q .url 2>/dev/null); then
  echo "Pull request already exists: $pr_url"
  exit 0
fi

# If not, create a new pull request
echo "Creating new pull request for branch $branch"
# --fill automatically populates title and body using commit messages
# Adjust flags or text as necessary
gh pr create --fill --repo "$repo_url"
