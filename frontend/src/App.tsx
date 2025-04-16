import { useState } from 'react';
import './App.css';
import BookList from './BookList';
import CategoryFilter from './Categoryfilter';
import WelcomeBand from './WelcomeBand';

function App() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  return (
    <div className="container mt-4">
      <div className="row">
        <WelcomeBand></WelcomeBand>
      </div>
      <div className="row">
        <div className="col-md-3">
          <CategoryFilter
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          ></CategoryFilter>
        </div>
        <div className="col-md-9">
          <BookList selectedCategories={selectedCategories}></BookList>
        </div>
      </div>
    </div>
  );
}

export default App;
