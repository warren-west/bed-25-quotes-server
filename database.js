let database = []

// Get All Quotes from the Database:
function getAllQuotes() {
    // HTTP 200 OK
    let result = ''
    for (let item of database) {
        result += item + '\n'
    }

    return { code: 200, data: result.trim(), message: "Retrieved all quotes from the database successfully!" }
}

// Get a quote from the database by ID:
function getQuoteById(id) {
    if (!database[id]) {
        return { code: 404, data: "", message: `Quote with the ID: ${id} was not found.` }
    }

    return { code: 200, data: database[id], message: "Successfully retrieved a quote from the DB." }
}

// Add a new quote into the DB:
function addQuote(quote) {
    if (!quote) {
        // 400 Bad Request
        return { code: 400, message: "Invalid input." }
    }

    database.push(quote)
    // HTTP 201 Created
    return { code: 201, message: "Successfully added quote to the database", data: database[database.length - 1] }
}

// Delete a quote from the database, by ID:
function deleteQuote(id) {
    // dealing with a 404 Not Found
    if (!database[id]) {
        return { code: 404, message: `Quote with the id: ${id} is not found.` }
    }

    database.splice(id, 1) // remove the element from the database array
    return { code: 204, message: `Quote with the id: ${id} has been deleted from the database.` }
}

// Update the text of a quote in the db, by ID:
function updateQuote(id, newQuote) {
    // validation: is the ID ok?
    if (id >= database.length) {
        return { code: 404, message: `Quote with the id: ${id} not found!` }
    }

    // is the new quote text okay?
    if (!newQuote) {
        return { code: 400, message: "Error: Invalid quote input!" }
    }

    // .map() returns an array, with each element in the array modified.
    database[id] = newQuote

    // return a response
    return { code: 204, message: "Success!" }

}

async function populateDatabase() {
    // TODO: Implement populating the database with staff data
    try {
        const resp = await fetch("http://backend.restapi.co.za/items/staff")
        const json = await resp.json()

        const staff = json.data
        database = staff.map(s => `${s.name} ${s.surname} (${s.email_address})`)

        return { code: 201, message: "Database populated successfully!" }
    } catch (err) {
        console.error(err)
        return { code: 500, message: "Server error"}
    }
}

module.exports = {
    getAllQuotes,
    getQuoteById,
    addQuote,
    deleteQuote,
    updateQuote,
    populateDatabase,
}