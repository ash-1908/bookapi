// to use environment variables

require("dotenv").config();

// framework (-> express)
const express = require("express");

// mongoose to connect to mongoDB
const mongoose = require("mongoose");

// local database file
const database = require("./database/index");

// models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");


// initialising express
const shapeAI = express();

// configurations
shapeAI.use(express.json());

// establishing database connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => console.log("Connection established!"));

/*

*************************API****************************

*/

// ----------------     BOOKS      -----------------


/*
Route       /book/all
Desc        to get all books
Access      PUBLIC
Parameters  NONE
Method      GET
*/

shapeAI.get("/book/all", async (req, res) => {

    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);

});


/*
Route       /book/isbn/ 
Desc        to get specific book based on ISBN number
Access      PUBLIC
Parameters  isbn
Method      GET
*/
shapeAI.get("/book/isbn/:isbn", async (req, res) => {
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});
    
    // const getSpecificBook = database.books.filter((book) =>
    //     book.ISBN === req.params.isbn);
    
    if(!getSpecificBook)
        return res.json({error: `No book found for the given ISBN: ${req.params.isbn}`});

    return res.json({book: getSpecificBook});
});


/*
Route       /book/category/
Desc        to get list of books based on a category
Access      PUBLIC
Parameters  category
Method      GET
*/

shapeAI.get("/book/category/:category", async (req, res) => {
    const booksOfCategory = await BookModel.find({
        category: req.params.category
    });
    
    // const booksOfCategory = database.books.filter((book) => 
    //     book.category.includes(req.params.category)
    // );

    if(booksOfCategory.length === 0)
        return res.json({error: `No book found of the given category ${req.params.category}`});

    return res.json({books: booksOfCategory});
});


/*
Route       /book/author/
Desc        get a list of books based on author
Access      PUBLIC
Parameters  author
Method      GET
*/
shapeAI.get("/book/author/:author", (req, res) => {
    const getAuthor = database.authors.filter
    ((author) => author.name === req.params.author);

    const booksByAuthor = getAuthor[0].books;

    const bookObjects = [];

    booksByAuthor.forEach((book) => {
        database.books.forEach((dbBook) => {
        if(dbBook.ISBN === book){
            bookObjects.push(dbBook);
        }
        });
    });

     return res.json({books: bookObjects});
});


/*
Route       /book/new
Desc        to add new book
Access      PUBLIC
Parameters  none
Method      POST
*/
shapeAI.post("/book/new", async (req, res) => {
    const {newBook} = req.body;


    const addNewBook = BookModel.create(newBook);
    // database.books.push(newBook);


    return res.json({books: addNewBook, message:
    "Book was added successfully."});
});


/*
Route       /book/update/
Desc        to update book details
Access      PUBLIC
Parameters  isbn
Method      PUT
*/
shapeAI.put("/book/update/:isbn", (req, res) => {
    const {updatedBookDetails} = req.body;

    const title = updatedBookDetails.title;
    const authors =  updatedBookDetails.authors;
    const language = updatedBookDetails.language;
    const pubDate = updatedBookDetails.pubDate;
    const numOfPage = updatedBookDetails.numOfPage;
    const category = updatedBookDetails.category;
    const publication = updatedBookDetails.publication;

    const updatedBooks = database.books.filter((book) => 
    book.ISBN !== req.params.isbn);
    
    updatedBook = {
        ISBN: req.params.isbn,
        title: title,
        authors: authors,
        language: language,
        pubDate: pubDate,
        numOfPage: numOfPage,
        category: category,
        publication: publication
    }

    updatedBooks.push(updatedBook);
    
    database.books = updatedBooks;

    return res.json({books: database.books, message:
    "Book was updated successfully."});
});


/*
Route       /book/author/new/
Desc        to add new author to a book
Access      PUBLIC
Parameters  isbn, authorId
Method      POST
*/
shapeAI.post("/book/author/new/:isbn/:authorId", (req, res) => {
    //find book and update author list
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.authors += req.params.authorId;
        }
    });

    //add author
    database.authors.push(newAuthor);

    return res.json({books: database.books, authors: database.authors, message: "New author was added."});

});


/*
Route       /book/delete/
Desc        to delete a book
Access      PUBLIC
Parameters  isbn
Method      DELETE
*/
shapeAI.delete("/book/delete/:isbn", (req, res) => {
    const updatedBookList = database.books.filter((book) =>
    book.ISBN !== req.params.isbn);

    database.books = updatedBookList;

    return res.json({books: database.books, 
        message: `Book with ISBN ${req.params.isbn} was deleted successfully.`});
});


/*
Route       /book/delete/author/
Desc        to delete an author for given book
Access      PUBLIC
Parameters  isbn, authorId
Method      DELETE
*/
shapeAI.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
    let updatedAuthorList = [];
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            updatedAuthorList = book.authors.filter((authorId) => 
            authorId !== parseInt(req.params.authorId));
        }

        book.authors = updatedAuthorList;
    });

    let updatedBookList = [];

    database.authors.forEach((author) => {
        if(author.id === req.params.authorId){
            updatedBookList = author.books.filter((book) => 
            book !== req.params.isbn);
        }

        author.books = updatedBookList;
    });

    return res.json({books: database.books,
        authors: database.authors, message: "Author was deleted successfully."});
});


// ----------------     AUTHORS      -----------------


/*
Route       /authors
Desc        to get all authors
Access      PUBLIC
Parameters  none
Method      GET
*/
shapeAI.get("/authors", (req, res) => {
    return res.json({Authors: database.authors});
});


/*
Route       /author/
Desc        to get a specific author
Access      PUBLIC
Parameters  authorId
Method      GET
*/
shapeAI.get("/author/:authorId", (req, res) => {
    const specificAuthor = database.authors.filter(
        (author) => author.id === parseInt(req.params.authorId)
    );

    if(specificAuthor.length === 0)
        return res.json({error: `No author found with the given id of ${req.params.authorId}`});

    return res.json({author: specificAuthor});
}); 


/*
Route       /authors/
Desc        to get list of authors based on a book
Access      PUBLIC
Parameters  isbn
Method      GET
*/

shapeAI.get("/authors/:isbn", (req, res) => {
    const getAuthors = database.authors.filter((author) => 
        author.books.includes(req.params.isbn)
    );
    
    if(getAuthors.length === 0)
        return res.json({error: `No Author found for the book of isbn ${req.params.isbn}`});
    

    return res.json({authors: getAuthors});
});


/*
Route       /author/new
Desc        to add new author
Access      PUBLIC
Parameters  none
Method      PUT
*/

shapeAI.put("/book/author/update/:isbn", (req, res) => {
    const {newAuthor} = req.body;

    database.authors.forEach((author) => {
        if(author.id === newAuthor.id){
            return res.json({Authors: database.authors,
                message: "Author already exist."});
            }
        });

    database.authors.push(newAuthor);

    return res.json({Authors: database.authors,
    message: "New author was added successfully."});
});


/*
Route       /author/delete/
Desc        to delete an author
Access      PUBLIC
Parameters  authorId
Method      DELETE
*/
shapeAI.delete("/author/delete/:authorId", (req, res) => {
    let updatedAuthorList = [];
    database.books.forEach((book) => {
        if(book.authors.includes(parseInt(req.params.authorId))){
            updatedAuthorList = book.authors.filter((authorId) => 
            authorId !== parseInt(req.params.authorId));
        }

        book.authors = updatedAuthorList;
    });

    updatedAuthorList = [];

    database.authors.forEach((author) => {
        if(author.id !== parseInt(req.params.authorId)){
            updatedAuthorList.push(author);
        }
    });

    database.authors = updatedAuthorList;

    return res.json({books: database.books,
        authors: database.authors, message: "Author was deleted successfully."});
});


// ----------------     PUBLICATIONS      -----------------


/*
Route       /publications
Desc        to get all publications
Access      PUBLIC
Parameters  none
Method      GET
*/

shapeAI.get("/publications", (req, res) => {
    return res.json({publications: database.publications});
});


/*
Route       /publication/
Desc        to get a specific publication
Access      PUBLIC
Parameters  pubId
Method      GET
*/
shapeAI.get("/publication/:pubId", (req, res) => {
    const specificPub = database.publications.filter(
        (publication) => publication.id === parseInt(req.params.pubId)
    );

    if(specificPub.length === 0)
        return res.json({error: `No publication found with the given id of ${req.params.pubId}`});

    return res.json({Publication: specificPub});
}); 



/*
Route       /publication/
Desc        to get list of publication based on a book
Access      PUBLIC
Parameters  isbn
Method      GET
*/

shapeAI.get("/publication/:isbn", (req, res) => {
    const getPub = database.publications.filter((publication) => 
    publication.books.includes(req.params.isbn)
    );
    
    if(getPub.length === 0)
        return res.json({error: `No publication found for the book of isbn ${req.params.isbn}`});
    

    return res.json({publication: getPub});
});


/*
Route       /publication/update/book
Desc        to update/add new publication
Access      PUBLIC
Parameters  isbn
Method      PUT
*/
shapeAI.put("/publication/update/book/:isbn", (req, res) => {
    // update the publication database
    database.publications.forEach((publication) => {
        if(publication.id === req.body.pubId){
            return publication.books.push(req.params.isbn);
        }
    });

    // update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.publication = req.body.pubId;
            return;
        }
    });

    return res.json({books: database.books, publications: database.publications, message: "Successfully updated publications!"});
});




/*
Route       /publication/delete/book/
Desc        to delete a book from publication
Access      PUBLIC
Parameters  isbn, publicationId
Method      DELETE
*/
shapeAI.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
    // update publication database
    database.publications.forEach((publication) => {
        if(publication.id === parseInt(req.params.pubId)){
            const newBookList = publicaton.books.filter((book) => book !== req.params.isbn
            );
            publication.books = newBookList;
            return;
        }
    }); 

    //update book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.publication = 0; //no publication available
            return;
        }
    });

    return res.json({books: database.books, publications: database.publications, message: "Publication deleted!"});
});



// Port to listen
shapeAI.listen(3000, () => console.log("Server is running")
);