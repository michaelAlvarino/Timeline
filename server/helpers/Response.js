const emptyResponse = { status: null, errors: [], data: null, success: null };

const Response = {
    empty: function empty() {
        return emptyResponse
    },
    custom: function custom(options) {
        let response = Object.assign({}, emptyResponse)

        if (options.hasOwnProperty('status'))
            response.status = options.status
        if (options.hasOwnProperty('success'))
            response.success = options.success
        if (options.hasOwnProperty('errors'))
            response.errors = options.errors
        if (options.hasOwnProperty('data'))
            response.data = options.data

        return response
    }
}

module.exports = Response