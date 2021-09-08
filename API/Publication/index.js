// Prefix: /publication

const Router = require("express").Router();

const PublicationModel = require("../../database/publication");

// GET

/*
Route       /all
Desc        to get all publications
Access      PUBLIC
Parameters  none
Method      GET
*/

Router.get("/all", async (req, res) => {
  try {
    const allPublications = await PublicationModel.find();
    return res.json(allPublications);
  } catch (error) {
    return res.json({ error: error.message });
  }
  //return res.json({publications: database.publications});
});

/*
Route       /pubId
Desc        to get a specific publication
Access      PUBLIC
Parameters  pubId
Method      GET
*/
Router.get("/pubId/:pubId", async (req, res) => {
  try {
    const specificPub = await PublicationModel.findOne({
      id: req.params.pubId,
    });
    return res.json(specificPub);
  } catch (error) {
    return res.json({ error: error.message });
  }
  /* const specificPub = database.publications.filter(
        (publication) => publication.id === parseInt(req.params.pubId)
    );

    if(specificPub.length === 0)
        return res.json({error: `No publication found with the given id of ${req.params.pubId}`});

    return res.json({Publication: specificPub}); */
});

/*
Route       /book/
Desc        to get list of publication based on a book
Access      PUBLIC
Parameters  isbn
Method      GET
*/

Router.get("/book/:isbn", async (req, res) => {
  try {
    const getPubOfBook = await PublicationModel.findOne({
      books: { $in: req.params.isbn },
    });
    return res.json(getPubOfBook);
  } catch (error) {
    return res.json({ error: error.message });
  }
  /* const getPub = database.publications.filter((publication) => 
    publication.books.includes(req.params.isbn)
    );
    
    if(getPub.length === 0)
        return res.json({error: `No publication found for the book of isbn ${req.params.isbn}`});
    

    return res.json({publication: getPub}); */
});

// POST

/*
Route       /new
Desc        to add new publication
Access      PUBLIC
Parameters  none
Method      POST
*/
Router.post("/new", async (req, res) => {
  try {
    const { publication } = req.body;
    await PublicationModel.create(publication);
    return res.json({ message: `${publication} was added successfully` });
  } catch (error) {
    return res.json({ error: error.message });
  }
  // update the publication database
  /* database.publications.forEach((publication) => {
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

    return res.json({books: database.books, publications: database.publications, message: "Successfully updated publications!"}); */
});

// PUT

/*
Route       /update/
Desc        to update the name of the publication using id
Access      PUBLIC
Parameters  pubId
Method      PUT
*/
Router.put("/update/:pubId", async (req, res) => {
  try {
    const { name } = req.body;
    const updatedPublication = await PublicationModel.findOneAndUpdate(
      { id: req.params.pubId },
      { name },
      { new: true }
    );
    return res.json({
      message: `${updatedPublication} was updated successfully`,
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
Route       /update//book/new/
Desc        to add a new book to a publication
Access      PUBLIC
Parameters  isbn, publicationId
Method      PUT
*/
Router.put("/update/book/:pubId/:isbn", async (req, res) => {
  try {
    const updatedPub = await PublicationModel.findOneAndUpdate(
      { id: req.params.pubId },
      { $push: { books: req.params.isbn } },
      { new: true }
    );
    return res.json({ message: `${updatedPub} book was added successfully` });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

// DELETE

/*
Route       /delete/book/
Desc        to delete a book from publication
Access      PUBLIC
Parameters  isbn, publicationId
Method      DELETE
*/
Router.delete("/delete/book/:isbn/:pubId", async (req, res) => {
  try {
    const updatedPub = await PublicationModel.findOneAndUpdate(
      { id: req.params.pubId },
      { $pull: { books: req.params.isbn } },
      { new: true }
    );
    return res.json({ message: `${updatedPub} book was removed successfully` });
  } catch (error) {
    return res.json({ error: error.message });
  }
  // update publication database
  /* database.publications.forEach((publication) => {
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

    return res.json({books: database.books, publications: database.publications, message: "Publication deleted!"});*/
});

/*
Route       /delete/
Desc        to delete a publication
Access      PUBLIC
Parameters  pubId
Method      DELETE
*/
Router.delete("/delete/:pubId", async (req, res) => {
  try {
    const pub = await PublicationModel.findOneAndDelete({
      id: req.params.pubId,
    });
    return res.json({ message: `${pub} was deleted successfully` });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

module.exports = Router;
