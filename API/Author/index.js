// Prefix: /author

const Router = require("express").Router();

const AuthorModel = require("../../database/author");

// GET

/*
Route       /all
Desc        to get all authors
Access      PUBLIC
Parameters  none
Method      GET
*/
Router.get("/all", async (req, res) => {
    const allAuthors = await AuthorModel.find();
    return res.json(allAuthors);
    //return res.json({Authors: database.authors});
});


/*
Route       /authorId
Desc        to get a specific author
Access      PUBLIC
Parameters  authorId
Method      GET
*/
Router.get("/authorId/:authorId", async (req, res) => {
    const author = await AuthorModel.findOne({id: req.params.authorId});
    if(!author) return res.json(`No author with author Id ${req.params.authorId} found`);
    return res.json(author);
    /* const specificAuthor = database.authors.filter(
        (author) => author.id === parseInt(req.params.authorId)
    );

    if(specificAuthor.length === 0)
        return res.json({error: `No author found with the given id of ${req.params.authorId}`});

    return res.json({author: specificAuthor}); */
}); 


/*
Route       /book/
Desc        to get list of authors based on a book
Access      PUBLIC
Parameters  isbn
Method      GET
*/

Router.get("/book/:isbn", async (req, res) => {
    const authors = await AuthorModel.find({books: {$in: req.params.isbn}});
    if(!authors) return res.json({message: `No authors found`});
    return res.json(authors);
    /* const getAuthors = database.authors.filter((author) => 
        author.books.includes(req.params.isbn)
    );
    
    if(getAuthors.length === 0)
        return res.json({error: `No Author found for the book of isbn ${req.params.isbn}`});
    

    return res.json({authors: getAuthors}); */
});

// POST

/*
Route       /new
Desc        to add new author
Access      PUBLIC
Parameters  none
Method      POST
*/

Router.post("/new", async (req, res) => {
    const {author} = req.body;
    const addAuthor = await AuthorModel.create(author);
    return res.json({message: `new author ${addAuthor} was added successfully`});
    /* const {newAuthor} = req.body;

    database.authors.forEach((author) => {
        if(author.id === newAuthor.id){
            return res.json({Authors: database.authors,
                message: "Author already exist."});
            }
        });

    database.authors.push(newAuthor);

    return res.json({Authors: database.authors,
    message: "New author was added successfully."}); */
});

// PUT

/*
Route       /update/
Desc        to update author name using id
Access      PUBLIC
Parameters  authorId
Method      PUT
*/
Router.put("/update/:authorId", async (req, res) => {
    const {authorName} = req.body;
    const updatedAuthor = await AuthorModel.findOneAndUpdate({id: req.params.authorId}, {name: authorName});
    return res.json({message: `Author ${updatedAuthor} was updated successfully`});
});

// DELETE

/*
Route       /delete/
Desc        to delete an author
Access      PUBLIC
Parameters  authorId
Method      DELETE
*/
Router.delete("/delete/:authorId", async (req, res) => {
    const deletedAuthor = await AuthorModel.findOneAndDelete({id: req.params.authorId});
    return res.json({message: `Author ${deletedAuthor} was deleted successfully`});
    /* let updatedAuthorList = [];
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
        authors: database.authors, message: "Author was deleted successfully."}); */
});

module.exports = Router;
