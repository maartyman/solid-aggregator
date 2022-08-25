import fetch from "node-fetch";

let queryExplanation = {
    queryString: `
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    SELECT ?n WHERE {
      ?p a foaf:Person .
      ?p foaf:name ?n .
    }
    `,
    sources: [
        "http://localhost:3000/user1/profile/card",
    ],
    comunicaVersion: "link-traversal",
    context: "link-traversal-follow-all"
}

fetch("http://localhost:4000", {
    method: "POST",
    body: JSON.stringify(queryExplanation),
    headers: {
        'Content-Type': 'application/json'
    }
}).then((response) => {
    console.log(response.status.toString());
    console.log(JSON.stringify(response.headers.get("location")).toString());
    fetch(`http://localhost:4000/${response.headers.get("location")}`, {
        method: "GET",
    }).then((response) => {
        console.log(response.status.toString());
        let body = response.body.read();
        console.log(body? body.toString() : "null");
    });
});


