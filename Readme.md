TODOs:
* API_BASE_URL in react app is hardcoded, ideally it should be coming from env variable.
* Sort functionality is pending, bit lack of clarity as the API specs don't mention these.
* Storing wallet id in localstorage could be a potential security risk (maybe using encryption will help).
* Deploying it to some baremetal machine.
* Adding more env variables configuration to docker-compose.yml.

Functional Requirements:
* Users should be able to create a new wallet.
* Users should be able to creadit/debit from the wallet.
* Store the wallet information in LocalStorage (only storing id).
* Export to CSV and sorting.


## Spinning up servers

Run the below command from root directory, it'll take care of building and spinning up docker images.
- ```docker compose up --build```

After spinning up servers, you can visit following endpoints:
- Access mongoDB GUI [here](http://localhost:8081/)
- Access UI part [here][http://localhost:3000/]
- Acces API endpoint [here][http://localhost:7001/]
