import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import { Route } from 'react-router-dom'
import BookShelf from './BookShelf'
import BookShelfContainer from './BookShelfContainer'
import SearchShelf from './SearchShelf'

class BooksApp extends React.Component {
  state = {
    currentlyReadingBooks: [],
    wantToReadBooks: [],
    readBooks: [],
    notInShelfBooks: [],
    searchedBooks: [],
    searchField: "",
    bookshelves: [
      {
        name: "Currently Reading",
        value: "currentlyReading"
      },
      {
        name: "Want to Read",
        value: "wantToRead"
      },
      {
        name: "Read",
        value: "read"
      }
    ]
  }

  getAllBooks() {
    return BooksAPI.getAll();
  }

  searchBook(searchTerm) {
    return BooksAPI.search(searchTerm);
  }

  updateBooksState(books) {
    let currentlyReadingBooks = [];
    let wantToReadBooks = [];
    let readBooks = [];
    let notInShelfBooks = [];

    books.map((book) => {
      if (book.shelf === "currentlyReading") {
        currentlyReadingBooks.push(book);
      } else if (book.shelf === "wantToRead") {
        wantToReadBooks.push(book);
      } else if (book.shelf === "read") {
        readBooks.push(book);
      } else {
        notInShelfBooks.push(book);
      }
    });

    this.setState({
      currentlyReadingBooks: currentlyReadingBooks,
      wantToReadBooks: wantToReadBooks,
      readBooks: readBooks,
      notInShelfBooks: notInShelfBooks
    });
  }

  updateSearchedBooksState(searchResult, allBooksInShelf) {
    let searchedBooks = [];

    // Update the shelf information.
    if(Array.isArray(searchResult)) {
      let lookupBooksInShelf = [];
      allBooksInShelf.forEach((book) => {
        lookupBooksInShelf[book.id] = book;
      });

      searchedBooks = searchResult.map((searchedBook) => {
        let lookupResult = lookupBooksInShelf[searchedBook.id];
        if (lookupResult != null) {
          searchedBook.shelf = lookupResult.shelf;
        }

        return searchedBook;
      });
    }

    this.setState({
      searchedBooks: searchedBooks
    });
  }

  componentDidMount() {
    this.getAllBooks().then((books) => {
      this.updateBooksState(books);
    })
  }

  moveBookToShelf = (bookToMove, shelfToMoveTo) => {
    // We can add a catch to reset the state, if this call had failed.
    BooksAPI.update(bookToMove, shelfToMoveTo);

    this.setState((prevState) => {
      let currentlyReadingBooks = [];
      let wantToReadBooks = [];
      let readBooks = [];

      bookToMove.shelf = shelfToMoveTo;

      currentlyReadingBooks = prevState.currentlyReadingBooks.filter(book => book.id !== bookToMove.id);
      wantToReadBooks = prevState.wantToReadBooks.filter(book => book.id !== bookToMove.id);
      readBooks = prevState.readBooks.filter(book => book.id !== bookToMove.id);

      if (shelfToMoveTo === "currentlyReading") {
        currentlyReadingBooks = prevState.currentlyReadingBooks.concat(bookToMove);
      } else if (shelfToMoveTo === "wantToRead") {
        wantToReadBooks = prevState.wantToReadBooks.concat(bookToMove);
      } else if (shelfToMoveTo === "read") {
        readBooks = prevState.readBooks.concat(bookToMove);
      }

      return {
        currentlyReadingBooks: currentlyReadingBooks,
        wantToReadBooks: wantToReadBooks,
        readBooks: readBooks
      };
    });
  }

  getSearchedBooks = (searchTerm) => {
    this.setState({
      searchField: searchTerm
    });

    this.searchBook(searchTerm).then((searchResult) => {
      let allBooksInShelf = this.state.currentlyReadingBooks.concat(this.state.wantToReadBooks).concat(this.state.readBooks);

      this.updateSearchedBooksState(searchResult, allBooksInShelf);
    });
  }

  render() {
    return (
      <div className="app">
        <Route exact path="/" render={() => (
          <BookShelfContainer
            currentlyReadingBooks={this.state.currentlyReadingBooks}
            wantToReadBooks={this.state.wantToReadBooks}
            readBooks={this.state.readBooks}
            moveBookToShelf={this.moveBookToShelf}
            bookshelves={this.state.bookshelves}
          />
        )}
        />
        <Route path="/search" render={() => (
          <SearchShelf
          searchedBooks={this.state.searchedBooks}
          getSearchedBooks={this.getSearchedBooks}
          searchField={this.state.searchField}
          moveBookToShelf={this.moveBookToShelf}
          bookshelves={this.state.bookshelves}
          />
        )}
        />
      </div>
    )
  }
}

export default BooksApp
