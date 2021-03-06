import logo from "./logo.svg";
import "./App.css";
import { Fragment, Component } from "react";
import MyComponent from "./MyComponent";
import Counter from "./Counter";
import EventPractice from "./EventPractice";
import Say from "./Say";
import { IterationSample } from "./IterationSample";
import { LifeCycleSample } from "./LifeCycleSample";

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

class App extends Component {
  state = {
    color: "#000000",
  };
  handleClick = () => {
    this.setState({
      color: getRandomColor(),
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleClick}>랜덩 색상</button>
        <LifeCycleSample color={this.state.color} />
      </>
    );
  }
}

export default App;
