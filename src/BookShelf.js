import React from 'react'
import Book from './Book'

class BookShelf extends React.Component {

  render() {
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.bookshelfName}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
          {this.props.books.map((book) => (
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

export default BookShelf
