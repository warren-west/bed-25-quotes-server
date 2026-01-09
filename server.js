// Simple database of text quotes
// The server should manage requests from clients, enabling them to:
// 1. Get all quotes from the DB.
// 2. Get a quotes from the DB, by ID.
// 3. Add a new quote to the DB.
// 4. Delete a quote from the DB.
// 5. Update a quote text in the DB.

// CRUD: Create, Read, Update, Delete
// Quotes -> create, read, update and delete quotes

// Steps:
// 1. Import the http module.
// 2. Configure the server.
// 3. Run the server (listen).

const http = require('http')
const { getAllQuotes, getQuoteById, addQuote, deleteQuote } = require('./database.js')

http.createServer((req, res) => {
    // Get METHOD and URL from request
    const method = req.method
    const url = req.url

    console.log(`METHOD: ${method}`)
    console.log(`URL: ${url}`)

    // if method is GET (getAllQuotes or getOneQuoteById)
        // if URL ends with /{:id} we want to get a single quote
        // if it ends with /all we return all the quotes in the database
    // if method is POST addQuote
    // if method is PUT updateQuote
    // if method is DELETE deleteQuote

    if (method == "GET" && url.endsWith("/all")) {
        // return all the quotes from the DB
        const result = getAllQuotes()

        console.log(result.message)

        // construct a response:
        res.statusCode = result.code
        res.write(result.data)
        res.end()
        return

    } else if (method == "GET") {
        // return a single element by ID

        // "/1".split('/') -> ["", "1"]
        // "/22".split('/') -> ["", "22"]
        const id = Number(url.split('/')[1])
        const result = getQuoteById(id)
        
        console.log(result.message)
        
        // construct the response:
        res.statusCode = result.code
        res.write(result.data)
        res.end()

        return

    } else if (method == "POST") {
        // add a quote to the db
        // get the text attached to the request body
        let data = ""

        // the request object has an event trigger that we can use; the on() function
        // .on("data")
        // .on("end")
        req.on("data", (chunk) => {
            data += chunk
        })
        req.on("end", () => {
            console.log(data)

            const result = addQuote(data)

            console.log(result.message)

            res.statusCode = result.code
            res.write(result.data)
            res.end()

            return
        })

    } else if (method == "DELETE") {
        // delete item from db

        // get the ID from the URL
        const id = Number(url.split('/')[1])

        // call the deleteQuote() function
        const result = deleteQuote(id)

        // create the response
        res.statusCode = result.code
        res.write(result.message)
        res.end()

        // return
        return

    } else if (method == "PUT") {
        // update item in DB

    }
})
.listen(8080, () => {
    console.log(`Server is running on port 8080...`)
})