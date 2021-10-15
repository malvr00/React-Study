import React, { Component } from "react";

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
      test: "test hello",
    };
  }
  render() {
    const { number } = this.state;
    return (
      <>
        <h1>{number}</h1>
        <button
          onClick={() => {
            this.setState({ number: number + 1 }, () => {
              console.log("방금 setState가 호출");
              console.log(this.state);
            });
          }}
        >
          +1
        </button>
      </>
    );
  }
}

export default Counter;
