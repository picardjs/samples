import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      ["pi-component"]: { name: string; source: string };
    }
  }
}

function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      <div className="card">
        <div className="row">
          <div className="col-sm-4">
            <h3>Static Column 1</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris...
            </p>
          </div>
          <div className="col-sm-4">
            <pi-component name="column" source="mf-simple-html"></pi-component>
          </div>
          <div className="col-sm-4">
            <pi-component name="column" source="nfsimplehtml"></pi-component>
          </div>
        </div>
        <div className="d-flex p-2 justify-content-center">
          <pi-component name="counter" source="pi-simple-html"></pi-component>
        </div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
