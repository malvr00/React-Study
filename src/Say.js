import React, { useState } from "react";

const Say = () => {
  const [message, setMessage] = useState("");
  const onClickEvent = () => setMessage("안녕하세요");
  const onClickLeave = () => setMessage("잘가");

  return (
    <>
      <button onClick={onClickEvent}>입장</button>
      <button onClick={onClickLeave}>퇴장</button>
      <h1>{message}</h1>
    </>
  );
};

export default Say;
