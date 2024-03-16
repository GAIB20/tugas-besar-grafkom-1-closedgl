import iconLine from './assets/line.svg';
import iconSquare from './assets/square.svg';
import iconRectangle from './assets/rectangle.svg';
import iconPolygon from './assets/polygon.svg';
import iconFillColor from './assets/fill-color.svg';
import iconSave from './assets/save.svg';

function handleLine() {
  console.log("Hello, World");
}

function handleSquare() {
  console.log("Hello, World");
}

function handleRectangle() {
  console.log("Hello, World");
}

function handlePolygon() {
  console.log("Hello, World");
}

function handleFillColor() {
  console.log("Hello, World");
}

function handleSave() {
  console.log("Hello, World");
}

function App() {
  return (
    <div className="">
      {/* SideBar */}
      <div className='w-20 h-screen flex flex-col bg-blue-300 justify-center items-center gap-3'>
        <button onClick={handleSave}>
          <img src={iconSave} alt="Save" className="button-img"/>
        </button>

        <button onClick={handleLine}>
          <img src={iconLine} alt="Line" className="button-img"/>
        </button>

        <button onClick={handleSquare}>
          <img src={iconSquare} alt="Square" className="button-img"/>
        </button>

        <button onClick={handleRectangle}>
          <img src={iconRectangle} alt="Rectangle" className="button-img"/>
        </button>

        <button onClick={handlePolygon}>
          <img src={iconPolygon} alt="Polygon" className="button-img"/>
        </button>

        <button onClick={handleFillColor}>
          <img src={iconFillColor} alt="Fill Color" className="button-img"/>
        </button>
      </div>
    </div>
  );
}

export default App;
