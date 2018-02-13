import React from 'react'
import { Link } from 'react-router-dom'
import Book from './Book'

class SearchShelf extends React.Component {

  componentDidMount() {
    if (this.props.searchField !== "") {
      this.props.getSearchedBooks(this.props.searchField);
    }
  }

  handleChange = (event) => {
    this.props.getSearchedBooks(event.target.value);
  }

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search"
            to="/"
          >Close</Link>
          <div className="search-books-input-wrapper">
            <input value={this.props.searchField} type="text" placeholder="Search by title or author" onChange={this.handleChange} />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
          {this.props.searchedBooks.map((book) => (
            <li key={book.id}>
              <Book
              book={book}
              bookshelves={this.props.bookshelves}
              moveBookToShelf={this.props.moveBookToShelf}
              />
            </li>
          ))}
          </ol>
        </div>
      </div>
    );
  }
}

export default SearchShelf
