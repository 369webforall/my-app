import ReviewList from './components/reviews/ReviewList';
import 'react-loading-skeleton/dist/skeleton.css';
function App() {
  return (
    <>
      <div className="container mx-auto">
        <ReviewList productId={2} />
      </div>
    </>
  );
}

export default App;
