set wwwDestination=pi@web-server:~/budgetApp/www
set backEndDestination=pi@web-server:~/budgetApp

echo "deploying to the server specified in the deploy-automaton.bat file"
echo "wwwDestination : " %wwwDestination%
echo "backEndDestination : " %backEndDestination%

ssh pi@web-server
rm -rf budgetApp
mkdir budgetApp
cd budgetApp
mkdir www
exit

scp build/* %wwwDestination%
scp src/server.js %backEndDestination%
