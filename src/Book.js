import React from 'react'

class Book extends React.Component {

  moveBookToShelf = (event) => {
    this.props.moveBookToShelf(this.props.book, event.target.value);
  }

  getBookShelfValue() {
    return this.props.book.shelf != null ? this.props.book.shelf : "none";
  }

  getBackgroundImage() {
    let imageLinks = this.props.book.imageLinks;

    // Early Return!
    if(imageLinks == null) {
      return "";
    }

    return `url(${imageLinks.thumbnail})`;
  }

  render() {
    return (
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: this.getBackgroundImage() }}></div>
          <div className="book-shelf-changer">
            <select value={this.getBookShelfValue()} onChange={this.moveBookToShelf}>
              <option value="" disabled>Move to...</option>
              {this.props.bookshelves.map(shelf => (
                <option
                key={shelf.name}
                value={shelf.value}
                >{shelf.name}</option>
              ))}
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">{this.props.book.title}</div>
        <div className="book-authors">{this.props.book.authors}</div>
      </div>
    );
  }
}

export default Book
