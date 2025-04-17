import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { CartItem } from '../types/CartItem';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'bootstrap';
import { Toast } from 'bootstrap'; // at the top
import NewBookForm from './NewBookForm';
import EditBookForm from './EditBookForm';
import { deleteBook, fetchBooks } from '../api/BooksAPI';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const navigate = useNavigate();

  const { addToCart } = useCart();
  const [price, setPrice] = useState<number>(0);

  const handleAddToCart = (book: Book) => {
    const newItem: CartItem = {
      bookId: book.bookID,
      title: book.title || 'No Book Found',
      price: book.price,
    };

    addToCart(newItem);

    // Show toast
    const toastElement = document.getElementById('cart-toast');
    if (toastElement) {
      const toast = new Toast(toastElement);
      toast.show();
    }

    // Optional: comment out navigation if you want to stay on the page
    // navigate('/cart');
  };

  const handleDelete = async (bookID: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this book?'
    );
    if (!confirmDelete) return;

    try {
      await deleteBook(bookID);
      setBooks(books.filter((b) => b.bookID !== bookID));
    } catch (error) {
      alert('Failed to delete book. Please try again.');
    }
  };

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBooks(
          pageSize,
          pageNum,
          selectedCategories,
          sortOrder
        );
        setBooks(data.books);
        setTotalItems(data.totalNumBooks);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        setError('Failed to load books. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [pageSize, pageNum, sortOrder, selectedCategories]);

  useEffect(() => {
    const tooltipTriggerList = Array.from(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl);
    });
  }, [books]);

  if (loading) return <p> Loading Books...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="container mt-4">
      {/* Sorting Controls */}
      <div className="d-flex justify-content-between mb-3">
        <div>
          <label className="form-label me-2 fw-bold">Sort by Title:</label>
          <select
            className="form-select d-inline-block w-auto"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setPageNum(1);
            }}
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>

        {/* Results Per Page Dropdown */}
        <div>
          <label className="form-label me-2 fw-bold">Results per page:</label>
          <select
            className="form-select d-inline-block w-auto"
            value={pageSize}
            onChange={(p) => {
              setPageSize(Number(p.target.value));
              setPageNum(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      {!showForm && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(true)}
        >
          Add Book
        </button>
      )}

      {showForm && (
        <NewBookForm
          onSuccess={() => {
            setShowForm(false);
            fetchBooks(pageSize, pageNum, []).then((data) =>
              setBooks(data.books)
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSuccess={() => {
            setEditingBook(null);
            fetchBooks(pageSize, pageNum, []).then((data) =>
              setBooks(data.books)
            );
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}

      {/* Book Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>ISBN</th>
              <th>Category</th>
              <th>Page Count</th>
              <th>Price</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.bookID}>
                <td>
                  <span
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={`ISBN: ${b.isbn}\nPages: ${b.pageCount}`}
                  >
                    {b.title}
                  </span>
                </td>

                <td>{b.author}</td>
                <td>{b.publisher}</td>
                <td>{b.isbn}</td>
                <td>{b.category}</td>
                <td>{b.pageCount}</td>
                <td>${b.price.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleAddToCart(b)}
                  >
                    ➕ Add to Cart
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-primary btn-sm w-100 mb-1"
                    onClick={() => setEditingBook(b)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm w-100"
                    onClick={() => handleDelete(b.bookID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setPageNum(pageNum - 1)}
            >
              Previous
            </button>
          </li>

          {[...Array(totalPages)].map((_, i) => (
            <li
              key={i + 1}
              className={`page-item ${pageNum === i + 1 ? 'active' : ''}`}
            >
              <button className="page-link" onClick={() => setPageNum(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}
          >
            <button
              className="page-link"
              onClick={() => setPageNum(pageNum + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 1055 }}
      >
        <div
          className="toast align-items-center text-white bg-success border-0"
          id="cart-toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">✅ Book added to cart!</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookList;
