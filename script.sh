#!/bin/bash

echo "Automated web scrape script"
echo "This shell script will check the system time, and execute the desired"
echo "automated script if the first meets 5pm."
echo "-----------------------"
while true
do
    now="$(date +"%k")"
    echo "Checking system time..."
    echo "Hours: $now h"
    if [ "$now" = '08' ]; then
        echo "It's time!"
        echo "Running node script..."
        echo "Logs:"
        node index.js
        read -n1 -r -p "Press any key to exit..." key
        exit
    else
        echo "Not the time yet"
        echo "Sleeping..."
        echo "-----------------------"
        sleep 3000

    fi
done
