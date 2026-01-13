// Side note about try...catch blocks: 
function addTwoNumbers(a, b) {

    if (isNaN(a) || isNaN(b)) {
        console.log("This is not allowed!")
        throw Error
    } else {
        return a + b
    }

}

// below we have some risky code that COULD throw an Error
try {
    let x = addTwoNumbers(5, 5)
    let y = addTwoNumbers(3) // Error!
} catch (err) {
    console.log("Your program didn't crash")
    console.log("The error was handled gracefully...")
} finally {
    console.log("This will ALWAYS execute")
    console.log("regardless of whether an error was thrown")
}