import fetch from "node-fetch";

let jsonObject = {
    queryString: `
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    SELECT ?n WHERE {
      ?p a foaf:Person .
      ?p foaf:name ?n .
    }
    `,
    sources: [
        "http://localhost:3000/user1/profile/card"
    ]
}

fetch("http://localhost:4000", {
    method: "POST",
    body: JSON.stringify(jsonObject),
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
        console.log(response.body.read().toString());
    });
});


