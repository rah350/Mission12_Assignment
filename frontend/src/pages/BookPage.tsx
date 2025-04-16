import { useState } from 'react';
import CategoryFilter from '../components/Categoryfilter';
import BookList from '../components/BookList';
import WelcomeBand from '../components/WelcomeBand';
import CartSummary from '../components/CartSummary';

function ProjectPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <div className="container mt-4">
      <CartSummary />
      <WelcomeBand></WelcomeBand>

      <button
        className="btn btn-primary mb-3 d-md-none"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasFilters"
        aria-controls="offcanvasFilters"
      >
        📂 Filters
      </button>

      <div className="row">
        <div
          className="offcanvas offcanvas-start"
          tabIndex={-1}
          id="offcanvasFilters"
          aria-labelledby="offcanvasFiltersLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasFiltersLabel">
              Filter Categories
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <CategoryFilter
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 d-none d-md-block">
            <CategoryFilter
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
          <div className="col-md-9">
            <BookList selectedCategories={selectedCategories}></BookList>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;
