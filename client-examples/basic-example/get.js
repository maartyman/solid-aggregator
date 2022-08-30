
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
    ORDER BY ?friend1Name
    `,
    lenient: true,
    sources: [
        "http://localhost:3000/user1/profile/card",
    ],
    comunicaVersion: "link-traversal",
    //comunicaContext: QueryExplanation.linkTraversalFollowMatchQuery
}

let location = "";

fetch("http://localhost:3001", {
    method: "POST",
    body: JSON.stringify(queryExplanation),
    headers: {
        'Content-Type': 'application/json'
    }
}).then((response) => {
    console.log("\nPost request");
    console.log(response.status.toString());
    console.log(response.headers.get("location").toString());
    location = response.headers.get("location").toString();
    let parsedData = JSON.parse(response.body.read());
    for (const binding of parsedData.bindings){
        console.log("Received: ");
        for (const element of Object.keys(binding.entries)) {
            console.log("\t" + element + ": " + binding.entries[element].value);
        }
    }
    setTimeout(get, 3000);
});


function get() {
    console.log("\nGet request");

    fetch(`http://localhost:3001/${location}`, {
        method: "GET",
    }).then((response) => {
        console.log(response.status.toString());
        let parsedData = JSON.parse(response.body.read());
        for (const binding of parsedData.bindings){
            console.log("Received: ");
            for (const element of Object.keys(binding.entries)) {
                console.log("\t" + element + ": " + binding.entries[element].value);
            }
        }
    });
    setTimeout(get, 3000);
}
