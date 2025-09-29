/usr/bin/bash

cd /var/www/project

git pull origin main --ff-only

if [ ! -d "node_modules" ]; then
    npm install
fi
