module.exports = func => { // decorator; takes function as an input and return a function that takes the input function and modify and return
    return (req, res, next) => {
        func(req, res, next).catch(next); // catch an error and passes it to next
    }
}