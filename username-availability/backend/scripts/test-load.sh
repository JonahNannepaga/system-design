#!/bin/bash

# Load test script for the Username Availability System

# Define the number of requests and the target URL
REQUESTS=1000
TARGET_URL="http://localhost:3000/api/usernames"

# Run the load test using curl
for ((i=1; i<=REQUESTS; i++))
do
  curl -s -o /dev/null -w "Request $i: HTTP Response Code: %{http_code}\n" $TARGET_URL
done

echo "Load test completed for $REQUESTS requests."