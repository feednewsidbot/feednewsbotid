#!/bin/bash

# Path to Node.js executable (adjust if necessary)
NODE_PATH=$(which node)

# Path to your bot JavaScript file
BOT_PATH="/path/to/your/bot.js"

# Change working directory to where bot.js is located
cd $(dirname "$BOT_PATH")

# Start the bot using Node.js
$NODE_PATH $BOT_PATH >> bot.log 2>&1 &