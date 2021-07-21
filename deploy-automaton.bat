ssh pi@192.168.1.120 rm -rf budgetApp
ssh pi@192.168.1.120 mkdir -p budgetApp/www

scp build/* pi@192.168.1.120:~/budgetApp/www
scp src/server.js pi@192.168.1.120:~/budgetApp
scp package.json pi@192.168.1.120:~/budgetApp

ssh -t pi@192.168.1.120 "cd budgetApp; npm install --only=prod"