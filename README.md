# MAC499 - DBMS web application and tests

## Web application

App to run SQL code on MySQL or PostgreSQL and visualize the results.

### Running the server

[Node.js](https://nodejs.org/en/download), [MySQL](https://www.mysql.com/downloads/) and [PostgreSQL](https://www.postgresql.org/download/) need to be installed first.

Then, clone this repository:

```
git clone https://github.com/GustavoNogai/MAC499-dbms-app-and-tests.git
```

After cloning, go to the `backend` folder:

```
cd MAC499-dbms-app-and-tests/backend
```

Edit the file `database.js`, changing the user and password for both MySQL *(lines 15-16)* and PostgreSQL *(lines 12-13)* according to your machine's credentials.

Run the server using Node's *npm*:

```
npm run start
```

Finally, access the app using your browser at `localhost:3000`

## Tests

Performance tests, creating graphs using a Jupyter Notebook

### Run tests

To run the tests, clone this repository:

```
git clone https://github.com/GustavoNogai/MAC499-dbms-app-and-tests.git
```

After cloning, go to the `performance-test` folder:

```
cd MAC499-dbms-app-and-tests/performance-test
```

Then, run the scripts:

```
bash mysql_script.sh

bash postgresql_script.sh
```

After that, `.txt` files should have been generated, containing the raw results.

### Creating the graphs

The treated data and graphs can be made using the `generate_plots.ipynb`. After opening the file (with [Google Colab](https://colab.research.google.com/) for e.g.), change the names of the raw results files in the first cell, the variables are called `mysql_file` and `psql_file`. After that run all cells.