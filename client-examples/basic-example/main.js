import fetch from "node-fetch";
import {QueryExplanation} from "./utils/queryExplanation.js";
import pkg from "websocket";
const {client} = pkg;

let queryExplanation = {
    queryString: `
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    SELECT ?friend1Name ?friend2Name WHERE {
      ?p a foaf:Person .
      ?p foaf:knows ?friend1 .
      ?friend1 a foaf:Person .
      ?friend1 foaf:name ?friend1Name .
      ?friend1 foaf:knows ?friend2 .
      ?friend2 foaf:name ?friend2Name .
    }
    `,
    sources: [
        "http://localhost:3000/user1/profile/card",
    ],
    lenient: true,
    comunicaVersion: "link-traversal",
    //comunicaContext: QueryExplanation.linkTraversalFollowMatchQuery
}

fetch("http://localhost:3001", {
    method: "POST",
    body: JSON.stringify(queryExplanation),
    headers: {
        'Content-Type': 'application/json'
    }
}).then((response) => {
    console.log(response.status.toString());
    console.log(JSON.stringify(response.headers.get("location")).toString());

    let wsClient = new client();

    wsClient.on('connectFailed', function(error) {
        console.log('Connect Error: ' + error.toString());
    });

    wsClient.on('connect', function(connection) {
        console.log('WebSocket Client Connected');
        connection.on('error', function(error) {
            console.log("Connection Error: " + error.toString());
        });
        connection.on('close', function() {
            console.log('Connection Closed');
        });
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                let parsedData = JSON.parse(message.utf8Data);
                for (const binding of parsedData.bindings){
                    console.log("Received: ");
                    for (const element of Object.keys(binding.entries)) {
                        console.log("\t" + element + ": " + binding.entries[element].value);
                    }
                }
            }
        });
        connection.sendUTF(response.headers.get("location").toString());
    });

    wsClient.connect(`ws://localhost:3001`, 'bindings');
});
