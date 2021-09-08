// Prefix: /book

const Router = require("express").Router();

const BookModel = require("../../database/book");

// GET

/*
Route       /all
Desc        to get all books
Access      PUBLIC
Parameters  NONE
Method      GET
*/

Router.get("/all", async (req, res) => {

    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);

});


/*
Route       /isbn/ 
Desc        to get specific book based on ISBN number
Access      PUBLIC
Parameters  isbn
Method      GET
*/
Router.get("/isbn/:isbn", async (req, res) => {
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});
    
    // const getSpecificBook = database.books.filter((book) =>
    //     book.ISBN === req.params.isbn);
    
    if(!getSpecificBook)
        return res.json({error: `No book found for the given ISBN: ${req.params.isbn}`});

    return res.json({book: getSpecificBook});
});


/*
Route       /category/
Desc        to get list of books based on a category
Access      PUBLIC
Parameters  category
Method      GET
*/

Router.get("/category/:category", async (req, res) => {
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
Route       /author/
Desc        get a list of books based on author
Access      PUBLIC
Parameters  author
Method      GET
*/
Router.get("/author/:author", async (req, res) => {
    const author = req.params.author;
    let authorId = await AuthorModel.findOne({name: author});
    if(authorId)
        authorId = authorId.id;
    else
        return res.json({ error: `No book found by author ${req.params.author}` });
    const booksByAuthor = await BookModel.find({authors: authorId});
    return res.json({books: booksByAuthor});
    /* const getAuthor = database.authors.filter
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

     return res.json({books: bookObjects}); */
});


// POST

/*
Route       /new
Desc        to add new book
Access      PUBLIC
Parameters  none
Method      POST
*/
Router.post("/new", async (req, res) => {
    const {newBook} = req.body;


    const addNewBook = BookModel.create(newBook);
    // database.books.push(newBook);


    return res.json({books: addNewBook, message:
    "Book was added successfully."});
});

// PUT

/*
Route       /update/
Desc        to update book details
Access      PUBLIC
Parameters  isbn
Method      PUT
*/
Router.put("/update/:isbn", async (req, res) => {
    const {updatedBookDetails} = req.body;
    console.log(updatedBookDetails);
    const book = await BookModel.findOneAndUpdate(
      { ISBN: req.params.isbn },
      updatedBookDetails
    );

    return res.json({message: `${book} was updated successfully.`});
    /* const {updatedBookDetails} = req.body;

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
    "Book was updated successfully."}); */
});


/*
Route       /author/new/
Desc        to add new author to a book
Access      PUBLIC
Parameters  isbn, authorId
Method      PUT
*/
Router.put("/author/new/:isbn/:authorId", async (req, res) => {
    const book = await BookModel.findOneAndUpdate(
      { ISBN: req.params.isbn },
      { $push: { authors: parseInt(req.params.authorId) } },
      { new: true }
    );

    return res.json({message: `${book} was updated successfully`});
    //find book and update author list
    /* database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.authors += req.params.authorId;
        }
    });

    //add author
    database.authors.push(newAuthor);

    return res.json({books: database.books, authors: database.authors, message: "New author was added."});
 */
});

// DELETE

/*
Route       /delete/
Desc        to delete a book
Access      PUBLIC
Parameters  isbn
Method      DELETE
*/
Router.delete("/delete/:isbn", async (req, res) => {
    /* const updatedBookList = database.books.filter((book) =>
    book.ISBN !== req.params.isbn);

    database.books = updatedBookList;

    return res.json({books: database.books, 
        message: `Book with ISBN ${req.params.isbn} was deleted successfully.`}); */
    
    const deletedBook = await BookModel.findOneAndDelete({ISBN: req.params.isbn});

    return res.json({message: `${deletedBook} was deleted successfully`});
});


/*
Route       /author/delete/
Desc        to delete an author for given book
Access      PUBLIC
Parameters  isbn, authorId
Method      DELETE
*/
Router.delete("/author/delete/:isbn/:authorId", async (req, res) => {
    const book = await BookModel.findOneAndUpdate({ISBN: req.params.isbn}, {$pull: {authors: parseInt(req.params.authorId)}}, {new: true});
    if(!book)
        return res.json({message: `Book with ISBN ${req.params.isbn} not found`});

    return res.json({message: `${book} was updated successfully`});
    /* let updatedAuthorList = [];
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
        authors: database.authors, message: "Author was deleted successfully."}); */
});

module.exports = Router;