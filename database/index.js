let books = [{
    ISBN: "12345ONE",
    title: "Getting started with MERN",
    authors: [1, 2, 3],
    language: "en",
    pubDate: "2021-07-07",
    numOfPage: "225",
    category: ["fiction", "programming", "tech", "web dev"],
    publication: 1
},
{
    ISBN: "12345Two",
    title: "Getting started with Python",
    authors: [1, 2],
    language: "en",
    pubDate: "2021-07-07",
    numOfPage: "225",
    category: ["programming", "tech", "web dev"],
    publication: 1
},
{
    ISBN: "deleteme",
    title: "Getting started with bs",
    authors: [1, 2],
    language: "en",
    pubDate: "2021-07-07",
    numOfPage: "225",
    category: ["programming", "tech", "web dev"],
    publication: 1
}
];

let authors = [
{
    id: 1,
    name: "pavan",
    books: ["12345ONE"],
},
{
    id: 2,
    name: "anmol",
    books: ["12345Two"]
}
];

let publications = [
    {
        id: 1,
        name: "Chakra",
        books: ["12345ONE"]
    },
    {
        id: 2,
        name: "Pavan",
        books: []
    }
];

module.exports = {books, authors, publications};