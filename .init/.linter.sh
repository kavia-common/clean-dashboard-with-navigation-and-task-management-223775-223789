#!/bin/bash
cd /home/kavia/workspace/code-generation/clean-dashboard-with-navigation-and-task-management-223775-223789/task_frontend
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

