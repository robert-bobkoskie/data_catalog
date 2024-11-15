######################
# Project Tree
# API: Test the backend with a curl command to fetch data
# config.json
# useEffect Hook
# aws cli commands
######################


######################
# Project Tree
######################
src/
├── assets/
│   ├── images/
│   │   └── logo.png
│   └── styles/
│       └── global.css
├── components/
│   ├── Header.js
│   └── Header.css
├── pages/
│   ├── HomePage.js
│   ├── AboutPage.js
│   └── ContactPage.js
├── App.js
└── index.js


######################
# Test the backend with a curl command to fetch data
######################

# API: Start flask backend:
$ python app.py

# API:  From another shell, run curl:
$ curl -X GET http://localhost:5000/api/query/tables
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:--  0:00:03 --:--:--     0

/* ========================
// useEffect Hook: When the component mounts, the useEffect hook checks local storage
// for any saved data. If data is found, it updates the state with this data.
// Local Storage: When new data is fetched from the backend, it is saved to local
// storage using localStorage.setItem('data', JSON.stringify(response.data)).
======================== */


/* Frontend Layer ========================
config.json: The frontend is responsible for displaying data to the user and capturing user input.
It communicates with the backend via HTTP requests to API endpoints.
Example: A React component might fetch data from your Flask API and display it in a table.

$ cat src/config.json
{
  "backend": "http://localhost:5000/api/query"
}
======================== */

// Example React component
import React, { useEffect, useState } from 'react';

function DataTable() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/query/tables')
      .then(response => response.json())
      .then(data => setTables(data));
  }, []);

  return (
    <div><h1>All Tables</h1><ul>
        {tables.map(table => (
          <li key={table.id}>{table.name}</li>
        ))}
      </ul></div>
  );
}
export default DataTable;

######################
# aws cli
######################

# List Buckets:
$ aws s3 ls


# List the Contents of the S3 Bucket:
$ aws s3 ls s3://s3.cloudfront.react-data-catalog

# Copy Files to S3 Bucket:
###   aws s3 cp your-file.txt s3://your-bucket-name/
###   aws s3 cp your-directory/ s3://your-bucket-name/ --recursive


Sync Local Directory to S3 Bucket:
###   aws s3 sync your-local-directory/ s3://your-bucket-name/

========================================
- Try t haws update command
- Try the curl command

Edit README:
- Add in aws commands to add, update
- Add the python comment
- Add the DataPage caomment
- Add the curl command
