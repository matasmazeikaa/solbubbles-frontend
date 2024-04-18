#!/bin/bash
set -e

echo "Deploying to production..."

git pull origin main

echo "Installing dependencies..."
yarn install

echo "Building..."
yarn build

echo "Deployment Finished"
