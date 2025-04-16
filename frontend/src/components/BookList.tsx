import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { CartItem } from '../types/CartItem';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'bootstrap';
import { Toast } from 'bootstrap'; // at the top

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string>('asc');

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

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `bookCategories=${encodeURIComponent(cat)}`)
        .join('&');

      const response = await fetch(
        `https://localhost:44344/api/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}${selectedCategories.length ? `&${categoryParams}` : ''}`
      );
      const data = await response.json();
      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(totalItems / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, sortOrder, totalItems, selectedCategories]);

  useEffect(() => {
    const tooltipTriggerList = Array.from(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl);
    });
  }, [books]);

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
