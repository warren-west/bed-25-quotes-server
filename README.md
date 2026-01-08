# Quotes Library
Implementing CRUD (create, read, update, delete) functionality for a JavaScript server.
I am building some layers into this project, separating the server and database logic, so that the flow of the project is like:


**Client ⇄ Server ⇄ Database**

## Installation
Clone this project with the command:
```bash
git clone https://github.com/warren-west/bed-25-quotes-server.git
```

## Explanation
### `server.js`
The server is created using `http.createServer()` and configured to listen on port 8080.
```javascript
const http = require('http')
// ... imports from database.js

http.createServer((req, res) => {
    // Request handling logic goes here
}).listen(8080, () => {
    console.log(`Server is running on port 8080...`)
})
```
You may notice in this example, I'm chaining the `.listen()` function directly to the tail of the `.createServer()` function, and skipping creating a server variable, like in the previous example. In effect it's the same as doing this:
```javascript
function addTwoNumbers(x, y) {
  return x + y
}
```
instead of this:
```javascript
function addTwoNumbers(x, y) {
  const sum = x + y // avoiding the middleman variable
  return sum
}
```
**Handling `GET` requests:**


The server distinguishes between fetching all quotes and fetching a specific quote by ID by analyzing the url and method.
- Fetch All: If the URL ends in `/all`.
- Fetch by ID: It splits the URL string (e.g., `/2`) and converts the segment to a `Number` to find a specific entry.
```javascript
if (method == "GET" && url.endsWith("/all")) {
  const result = getAllQuotes()
  res.statusCode = result.code
  res.write(result.data)
  res.end()
  return
} else if (method == "GET") {
  const id = Number(url.split('/')[1])
  const result = getQuoteById(id)
  res.statusCode = result.code
  res.write(result.data)
  res.end()
  return
}
```
**Handling `POST` requests:**


Since Node.js treats incoming request bodies as streams, we must listen for "chunks" of data to arrive. Once the stream is finished (`req.on("end")`), the data is processed and sent to the database.
```javascript
// Collect the incoming stream of data in chunks
req.on("data", (chunk) => {
    data += chunk // Assemble the incoming data string
})
// When the chunks have all been collected, handle the totality of the data collected
req.on("end", () => {
    const result = addQuote(data); // Save the new quote
    res.statusCode = result.code
    res.end()
})
```

### `database.js`
The "database" is represented by a simple JavaScript Array. Each entry is stored as a string containing a quote and its author.
```javascript
const database = [
    "It always seems impossible until it's done(Nelson Mandela)",
    "Be the best version of you(Someone spiritual)",
]
```
**Fetching data:**


The file contains two primary ways to read data, handling the "Read" part of CRUD operations.:
- getAllQuotes(): Iterates through the entire array using a `for...of` loop and joins them into a single string separated by newlines (`\n`). (Get a full list of records.)
- getQuoteById(id): Uses the array index to find a specific quote. It includes error handling to check if the ID exists; if not, it returns a 404 status code. (Get one single record.)

**Adding new data:**


The `addQuote` function handles the "Create" part of CRUD operations. It performs basic validation to ensure the input isn't empty before pushing the new string into the array.
```javascript
function addQuote(quote) {
  // quote parameter is empty, undefined, or null
  if (!quote)
    return { code: 400, message: "Invalid input." }

  database.push(quote) // add the quote to the database array
  // return an object with a response code, message and the newly inserted quote as "data"
  return {
      code: 201, // Created
      message: "Successfully added quote",
      data: database[database.length - 1]
  }
}
```

In this project I'm trying to standardize the kinds of responses I'm sending from the database to the server, i.e. all of the `return` objects have some or all of the properties:
- `code`: The HTTP status code (e.g., 200, 201, 404).
- `data`: The actual content (the quote or list of quotes).
- `message`: A human-readable string for server-side logging.


In the real world there are many different conventions people use for this, the main objective is to be consistent within your project, and to have it make a little bit of sense.

Tomorrow we will continue working on this demo to implement the missing functionality for updating a record in the database, and deleting a record from the database.
