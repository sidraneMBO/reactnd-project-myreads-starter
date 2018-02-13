import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import { Route } from 'react-router-dom'
import BookShelfContainer from './BookShelfContainer'
import SearchShelf from './SearchShelf'

class BooksApp extends React.Component {
  state = {
    currentlyReadingBooks: [],
    wantToReadBooks: [],
    readBooks: [],
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
  };

  getAllBooks() {
    return BooksAPI.getAll();
  }

  getSearchedBooks(searchTerm) {
    return BooksAPI.search(searchTerm);
  }

  getSearchedBooksWithShelfValue(searchTerm, allBooksInShelf) {
    return this.getSearchedBooks(searchTerm)
    .then((searchResult) => {
      let searchedBooks = [];

      if (Array.isArray(searchResult)) {
        const lookupBooksInShelf = [];
        allBooksInShelf.forEach((book) => {
          lookupBooksInShelf[book.id] = book;
        });

        searchedBooks = searchResult.map((searchedBook) => {
          const lookupResult = lookupBooksInShelf[searchedBook.id];
          if (lookupResult != null) {
            searchedBook.shelf = lookupResult.shelf;
          }

          return searchedBook;
        });
      }

      return searchedBooks;
    });
  }

  updateShelfBooksState(books) {
    const currentlyReadingBooks = [];
    const wantToReadBooks = [];
    const readBooks = [];

    books.forEach((book) => {
      if (book.shelf === "currentlyReading") {
        currentlyReadingBooks.push(book);
      } else if (book.shelf === "wantToRead") {
        wantToReadBooks.push(book);
      } else if (book.shelf === "read") {
        readBooks.push(book);
      }
    });

    this.setState({
      currentlyReadingBooks: currentlyReadingBooks,
      wantToReadBooks: wantToReadBooks,
      readBooks: readBooks
    });
  }

  updateShelfBooksStateAfterMove(bookToMove, shelfToMoveTo) {
    this.setState((prevState) => {
      const currentlyReadingBooks = prevState.currentlyReadingBooks.filter(book => book.id !== bookToMove.id);
      const wantToReadBooks = prevState.wantToReadBooks.filter(book => book.id !== bookToMove.id);
      const readBooks = prevState.readBooks.filter(book => book.id !== bookToMove.id);

      if (shelfToMoveTo === "currentlyReading") {
        currentlyReadingBooks.push(bookToMove);
      } else if (shelfToMoveTo === "wantToRead") {
        wantToReadBooks.push(bookToMove);
      } else if (shelfToMoveTo === "read") {
        readBooks.push(bookToMove);
      }

      return {
        currentlyReadingBooks: currentlyReadingBooks,
        wantToReadBooks: wantToReadBooks,
        readBooks: readBooks
      };
    });
  }

  updateSearchedBooksState(searchedBooks) {
    this.setState({
      searchedBooks
    });
  }

  updateSearchFieldState(searchTerm) {
    this.setState({
      searchField: searchTerm
    });
  }

  moveBookToShelf = (bookToMove, shelfToMoveTo) => {
    // TODO: Add a catch to reset the state, if update call fails.
    BooksAPI.update(bookToMove, shelfToMoveTo);
    bookToMove.shelf = shelfToMoveTo;
    this.updateShelfBooksStateAfterMove(bookToMove, shelfToMoveTo);
  };

  searchBooks = (searchTerm) => {
    this.updateSearchFieldState(searchTerm);
    let allBooksInShelf = this.state.currentlyReadingBooks.concat(this.state.wantToReadBooks).concat(this.state.readBooks);

    this.getSearchedBooksWithShelfValue(searchTerm, allBooksInShelf)
    .then((searchResult) => {
      this.updateSearchedBooksState(searchResult);
    });
  };

  componentDidMount() {
    this.getAllBooks()
    .then((books) => {
      this.updateShelfBooksState(books);
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
          searchBooks={this.searchBooks}
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
