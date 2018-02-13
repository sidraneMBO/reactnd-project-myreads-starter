import React from 'react'
import BookShelf from './BookShelf'
import { Link } from 'react-router-dom'

class BookShelfContainer extends React.Component {

  getBooksListForShelf(bookShelfName) {
    if (bookShelfName === "Currently Reading") {
      return this.props.currentlyReadingBooks;
    }

    if (bookShelfName === "Want to Read") {
      return this.props.wantToReadBooks;
    }

    if (bookShelfName === "Read") {
      return this.props.readBooks;
    }

    return [];
  }

  render() {
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
          {this.props.bookshelves.map((bookshelf) => (
            <BookShelf
            key={bookshelf.name}
            bookshelfName={bookshelf.name}
            books={this.getBooksListForShelf(bookshelf.name)}
            bookshelves={this.props.bookshelves}
            moveBookToShelf={this.props.moveBookToShelf}
            />
          ))}
          </div>
        </div>
        <div className="open-search">
          <Link
            to="/search"
          >Add a book</Link>
        </div>
      </div>
    );
  }
}

export default BookShelfContainer
