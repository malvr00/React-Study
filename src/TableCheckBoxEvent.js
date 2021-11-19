import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Table,
  Button,
} from "react-bootstrap";
import axios from "axios";
import { axiosUrlFunction, tokenCheck } from "utils/AxiosUrl";

export const CouponPay = (props) => {
  const couponUrl = axiosUrlFunction("coupon", "검색");
  const couponNumber = props.match.params.id;

  const [couponData, setCouponData] = useState(""); // 쿠폰정보
  const [gradeData, setgradeData] = useState([]); // 등급정보
  const [addList, setAddList] = useState(""); // 왼쪽 TABLE 추가한 명단
  const [userData, setUserData] = useState([
    // 왼쪽 TABLE 정보
    {
      user_id: "",
      user_name: "",
      phone: "",
      grade_name: "",
      checked: false,
    },
  ]);
  const [checkedUser, setCheckedUser] = useState([
    // 오른쪽 TABLE 정보
    {
      user_id: "",
      user_name: "",
      phone: "",
      grade_name: "",
      checked: "",
    },
  ]);
  const [userName, setUserName] = useState(""); // 고객명
  const [phone, setPhone] = useState(""); // 휴대폰번호
  const [userNumber, setUserNumber] = useState(""); // 고객번호
  const [grade, setGrade] = useState(1); // 고객등급
  const [count, setCount] = useState(0); // 고객 검색
  const [leftAllCheck, setLeftAllCheck] = useState(false); // TABLE 왼쪽 전체선택
  const [rightAllCheck, setRightAllCheck] = useState(false); // TALBE 오른쪽 전체선택
  const [changeCoupon, setChangeCoupon] = useState(true); // 쿠폰 뒷면 앞면

  // 등급 정보
  const getGrade = async () => {
    const gradeUrl = axiosUrlFunction("gradeList");
    axios
      .get(`${gradeUrl.apiUrl}`, {
        headers: {
          Authorization: `Bearer ${gradeUrl.token}`,
          "Content-Type": `application/json`,
        },
      })
      .then(async (res) => {
        const data = [];
        res.data.data.map((grade) => {
          data.push(grade);
        });
        setgradeData(data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          if (err.response.data.error === "Unauthorized") {
            // 토큰 재발급
            tokenCheck();
            getGrade();
          } else {
            alert("시스템오류가 발생하였습니다. \n관리자에게 문의하세요.");
          }
        } else {
          alert("시스템오류가 발생하였습니다. \n관리자에게 문의하세요.");
        }
      });
  };

  // 쿠폰정보
  const getCoupon = async () => {
    axios
      .get(`${couponUrl.apiUrl}?coupon_id=${couponNumber}`, {
        headers: {
          Authorization: `Bearer ${couponUrl.token}`,
          "Content-Type": `application/json`,
        },
      })
      .then(async (res) => {
        let data = res.data.data;
        if (data.discountType === "percent") {
          data.discount = data.discount + "%";
          data.discountType = "비율할인";
        } else {
          data.discount = data.discount.toLocaleString("ko-KO") + "원";
          data.discountType = "금액할인";
        }
        if (data.couponType === "prepaid") data.couponType = "선불권";
        else if (data.couponType === "program") data.couponType = "프로그램";
        else data.couponType = "제품";

        setCouponData(data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          if (err.response.data.error === "Unauthorized") {
            // 토큰 재발급
            tokenCheck();
            getCoupon();
          } else {
            alert("시스템오류가 발생하였습니다. \n관리자에게 문의하세요.");
          }
        } else {
          alert("시스템오류가 발생하였습니다. \n관리자에게 문의하세요.");
        }
      });
  };

  // 고객 검색
  const getUserInfor = async () => {
    const searchUserApi = axiosUrlFunction("user/search", "검색");

    // 기본 값 세팅
    const data = {
      name: userName,
      user_id: userNumber,
      phone: phone,
      grade_id: parseInt(grade),
    };

    // 빈 항목 제거
    const key1 = Object.keys(data);
    for (let i = 0; i < key1.length; i++) {
      if (data[key1[i]] === "") {
        delete data[key1[i]];
      }
    }
    // get 보낼 key 찾기 & string 화
    const key2 = Object.keys(data);
    const queries = [];
    for (let i = 0; i < key2.length; i++) {
      if (data[key2[i]]) {
        queries.push(`${key2[i]}=${data[key2[i]]}`);
      }
    }
    const queryStr = queries.length > 0 ? `?${queries.join("&")}` : "";

    axios
      .get(`${searchUserApi.apiUrl}${queryStr}`, {
        headers: {
          Authorization: `Bearer ${searchUserApi.token}`,
          "content-type": `application/json`,
        },
      })
      .then(async (res) => {
        const data = [];
        res.data.data.map((user) => {
          data.push(user);
        });

        if (data) {
          // 총 인원 및 검색 고객 저장
          setUserData(data);
          setCount(res.data.data.length);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          if (err.response.data.error === "Unauthorized") {
            // 토큰 재발급
            tokenCheck();
            getUserInfor();
          } else {
            alert("시스템오류가 발생하였습니다. \n관리자에게 문의하세요.");
          }
        } else {
          alert("시스템오류가 발생하였습니다. \n관리자에게 문의하세요.");
        }
      });
  };

  // 유저검색 테이블 체크박스 상태관리
  const leftUserInfor = (event, user) => {
    const data = [];
    const id = [];
    userData.map((check) => {
      data.push(check);
    });

    const { checked } = event.target;
    if (checked) {
      for (let i = 0; i < data.length; i++) {
        if (user.user_id === data[i].user_id) {
          data[i].checked = true;
          setUserData(data);
          return null;
        }
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (user.user_id === data[i].user_id) {
          data[i].checked = false;
          setUserData(data);
          return null;
        }
      }
    }
  };

  // 지급대상 테이블 체크박스 상태관리
  const rightUserInfor = (event, user) => {
    const data = [];

    checkedUser.map((check) => {
      data.push(check);
    });

    const { checked } = event.target;
    if (checked) {
      for (let i = 0; i < data.length; i++) {
        if (user.user_id === data[i].user_id) {
          data[i].checked = false;
          setCheckedUser(data);
          return null;
        }
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (user.user_id === data[i].user_id) {
          data[i].checked = true;
          setCheckedUser(data);
          return null;
        }
      }
    }
  };

  // 추가 버튼
  const adduserList = () => {
    const indexData = [];
    let sw = 0;
    for (let i = 0; i < userData.length; i++) {
      if (userData[i].checked === true) {
        checkedUser.push(userData[i]);
        indexData.push(i);
        sw = 1;
      }
    }

    for (let i = indexData.length - 1; i >= 0; i--) {
      userData.splice(indexData[i], 1);
    }
    if (sw === 1) {
      setCheckedUser([...checkedUser]);
    }

    setLeftAllCheck(false);
  };

  // 삭제 버튼
  const deleteuserList = () => {
    const indexData = [];

    for (let i = 0; i < checkedUser.length; i++) {
      if (!checkedUser[i].checked) {
        indexData.push(i);
        userData.push(checkedUser[i]);
      }
    }

    for (let i = indexData.length - 1; i >= 0; i--) {
      checkedUser.splice(indexData[i], 1);
    }
    setCheckedUser([...checkedUser]);
    setRightAllCheck(false);
  };

  // 전체선택
  const allcheckHandler = (event, sw) => {
    const { checked } = event.target;

    if (sw === 1) {
      if (checked) {
        userData.map((user) => {
          user.checked = true;
        });
        setLeftAllCheck(true);
      } else {
        userData.map((user) => {
          user.checked = false;
        });
        setLeftAllCheck(false);
      }
    } else {
      if (checked) {
        checkedUser.map((user) => {
          user.checked = false;
        });
        setRightAllCheck(true);
      } else {
        checkedUser.map((user) => {
          user.checked = true;
        });
        setRightAllCheck(false);
      }
    }
  };

  // 쿠폰지급 api
  const sendCoupon = async () => {
    const sendUrl = axiosUrlFunction("coupon/provision", "검색");

    const data = {
      coupon_id: parseInt(couponNumber),
      user_ids: [],
    };

    checkedUser.map((user) => {
      data.user_ids.push(user.user_id);
    });

    axios
      .post(`${sendUrl.apiUrl}`, data, {
        headers: {
          Authorization: `Bearer ${sendUrl.token}`,
          "Content-Type": `application/json`,
        },
      })
      .then(() => {
        props.history.push(`${sendUrl.accessPath}/usages/coupon/list`);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          if (err.response.data.error === "Unauthorized") {
            // 토큰 재발급
            tokenCheck();
            sendCoupon();
          } else {
            alert("시스템오류가 발생하였습니다. \n관리자에게 문의하세요.");
          }
        } else {
          alert("시스템오류가 발생하였습니다. \n관리자에게 문의하세요.");
        }
      });
  };

  useEffect(() => {
    getCoupon();
    getGrade();
  }, []);

  // 쿠폰 앞면 뒷면
  const couponDescription = changeCoupon ? (
    <div
      style={{
        padding: "20px",
      }}
    >
      <Button
        className="small"
        onClick={() => {
          setChangeCoupon(false);
        }}
      >
        뒷면
      </Button>
      <div className="coupon-name">{couponData.name}</div>
      <div className="coupon-desc">
        <div className="coupon-desc-amount">{couponData.discount}</div>
        <div className="coupon-desc-label">할인</div>
      </div>
    </div>
  ) : (
    <div
      style={{
        padding: "5px",
      }}
    >
      <Button
        className="small"
        onClick={() => {
          setChangeCoupon(true);
        }}
      >
        앞면
      </Button>
      <div>
        <h3>유의사항</h3>
        {couponData.explanation},
      </div>
      <div className="coupon-desc" style={{ fontSize: "17px" }}>
        <div>
          쿠폰 최소사용 금액은{" "}
          <span style={{ color: "red" }}>{couponData.minDiscountPrice}</span>
          이고,
        </div>
        <div>
          쿠폰 최대사용 금액은{" "}
          <span style={{ color: "red" }}>{couponData.minDiscountPrice}</span>
          입니다.
        </div>
      </div>
    </div>
  );

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card className="card-plain table-plain-bg">
            <Card.Header>
              <Card.Title as="h4">
                예약/사용 처리 - 쿠폰관리 - 쿠폰지급
              </Card.Title>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive px-0">
              <div className="row">
                <div
                  className={`col-2 tab-btn selected-tab`}
                  onClick={(e) => {}}
                >
                  쿠폰리스트
                </div>
              </div>
              <div className="couponpay">
                <div className="couponpay-column">
                  <div className="couponpay-title">
                    <h4>지급할 쿠폰</h4>
                  </div>
                  <div className="couponpay-description">
                    <div
                      className="coupon"
                      style={{
                        width: "400px",
                        height: "180px",
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "white",
                        textOverflow: "clip",
                        wordBreak: "break-all",
                      }}
                    >
                      {couponDescription}
                    </div>
                    <div className="coupon-content">
                      <div className="coupon-content__description">
                        <h4>쿠폰명 : </h4>
                        <span>　{couponData.name}</span>
                      </div>
                      <div className="coupon-content__description">
                        <h4>분류 : </h4>
                        <span>　{couponData.couponType}할인</span>
                      </div>
                      <div className="coupon-content__description">
                        <h4>할인방식 : </h4>
                        <span>
                          　{couponData.discountType}({couponData.discount})
                        </span>
                      </div>
                      <div className="coupon-content__description">
                        <h4>사용기한 : </h4>
                        <span>　발급일로 {couponData.couponPeriod}일</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="couponpay-column">
                  <div className="couponpay-title">
                    <h4>지급 대상 선택</h4>
                  </div>
                  <div className="couponpay-description">
                    <div>
                      <form className="couponpay-description__form">
                        <label className="couponpay-description__form__title">
                          고객명
                          <input
                            type="text"
                            onChange={(e) => {
                              setUserName(e.target.value);
                            }}
                            value={userName}
                          />
                        </label>
                        <label className="couponpay-description__form__title">
                          휴대포번호
                          <input
                            type="text"
                            onChange={(e) => {
                              setPhone(e.target.value);
                            }}
                            value={phone}
                          />
                        </label>
                        <label className="couponpay-description__form__title">
                          고객번호
                          <input
                            type="text"
                            onChange={(e) => {
                              setUserNumber(e.target.value);
                            }}
                            value={userNumber}
                          />
                        </label>
                        <span className="couponpay-description__form__title">
                          고객등급
                        </span>
                        <select
                          value={grade}
                          onChange={(e) => {
                            setGrade(e.target.value);
                          }}
                        >
                          {gradeData.map((grade) => {
                            return (
                              <option key={grade.gradeId} value={grade.gradeId}>
                                {grade.gradeName}
                              </option>
                            );
                          })}
                        </select>
                        <div
                          className="text-center"
                          style={{ marginTop: "15px" }}
                        >
                          <Button onClick={getUserInfor} className="mr-3">
                            검색
                          </Button>
                          <Button
                            onClick={() => {
                              if (window.confirm("초기화 하시겠습니까?")) {
                                setUserName("");
                                setPhone("");
                                setUserNumber("");
                                setGrade("basic");
                                return null;
                              }
                            }}
                          >
                            초기화
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="couponpay-column">
                  <div className="couponpay-title">
                    <h4>지급 대상 리스트</h4>
                  </div>
                  <div className="couponpay-description space-between">
                    <div>
                      <div style={{ marginBottom: "10px" }}>
                        총 <span style={{ color: "red" }}>{count}</span>명이
                        검색되었습니다.
                      </div>
                      <table className="scrolltbody">
                        <thead>
                          <tr>
                            <th>
                              <input
                                type="checkbox"
                                onChange={(e) => allcheckHandler(e, 1)}
                                checked={leftAllCheck}
                              />
                            </th>
                            <th>No</th>
                            <th>고객명</th>
                            <th>고객번호</th>
                            <th>휴대폰번호</th>
                            <th>고객등급</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userData.map((user, index) => {
                            if (user.user_name !== "") {
                              return (
                                <tr key={index}>
                                  <td>
                                    <input
                                      type="checkbox"
                                      onChange={(e) => leftUserInfor(e, user)}
                                      checked={user.checked || false}
                                    />
                                  </td>
                                  <td>{index + 1}</td>
                                  <td>{user.user_name}</td>
                                  <td>{user.user_id}</td>
                                  <td>{user.phone}</td>
                                  <td>{user.grade_name}</td>
                                </tr>
                              );
                            }
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="couponpay-description__button">
                      <Button onClick={adduserList}>추가</Button>
                      <Button onClick={deleteuserList}>삭제</Button>
                    </div>
                    <div>
                      <div style={{ marginBottom: "10px" }}>
                        <span style={{ fontWeight: "bold" }}>지급 대상</span>
                      </div>
                      <aside>
                        <table className="scrolltbody">
                          <thead>
                            <tr>
                              <th>
                                <input
                                  type="checkbox"
                                  onChange={(e) => allcheckHandler(e, 2)}
                                  checked={rightAllCheck || false}
                                />
                              </th>
                              <th>No</th>
                              <th>고객명</th>
                              <th>고객번호</th>
                              <th>휴대폰번호</th>
                              <th>고객등급</th>
                            </tr>
                          </thead>
                          <tbody>
                            {checkedUser.map((user, index) => {
                              if (user.user_name !== "") {
                                return (
                                  <tr key={index}>
                                    <td>
                                      <input
                                        type="checkbox"
                                        onChange={(e) =>
                                          rightUserInfor(e, user)
                                        }
                                        checked={!user.checked}
                                      />
                                    </td>
                                    <td>{index + 1}</td>
                                    <td>{user.user_name}</td>
                                    <td>{user.user_id}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.grade_name}</td>
                                  </tr>
                                );
                              }
                            })}
                          </tbody>
                        </table>
                      </aside>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center" style={{ marginTop: "50px" }}>
                <Button onClick={sendCoupon}>지급</Button>
                <Button
                  onClick={() => {
                    window.location.replace(
                      `${couponUrl.accessPath}/usages/coupon/list`
                    );
                  }}
                  className="ml-2"
                >
                  취소
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
