# Timeline
CRUD app to build timelines

## Development
Run the following commands for development

```sh
npm start               # start webpack dev server
node server/server.js   # start backend server (optionally, use nodemon)
```

## Response Format

```json
{  
    "success": <true/false>,  
    "data": <response data>,  
    "errors": [<array of errors>]  
}
```