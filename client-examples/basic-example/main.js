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
    console.log(JSON.stringify(response.headers).toString());
    console.log(response.body);
    /*
    fetch("http://localhost:4000", {
        method: "GET",
    }).then((response) => {
        console.log(response);
    });

     */
});


