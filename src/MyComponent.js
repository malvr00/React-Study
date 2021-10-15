import React from "react";
import PropTypes from "prop-types";
const MyComponent = ({ name, children }) => {
  return (
    <>
      새러운 컴퍼넌트 {name} <br />
      childern 값은 {children} 입니다.
    </>
  );
};

MyComponent.defaultProps = {
  name: "기본이름",
};

MyComponent.propTypes = {
  name: PropTypes.string,
};
export default MyComponent;
