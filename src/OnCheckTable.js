import { useState, useEffect } from "react";
import "../css/Login.scss";
import { Modal, Button, Row, Col, Form, Card, Table } from "react-bootstrap";
import axios from "axios";
import { axiosUrlFunction, tokenCheck } from "utils/AxiosUrl";

// 단일 선택
export const SelectProgramOnCheckPopup = (props) => {
  const [list, setList] = useState([
    {
      value: "",
      programId: "",
      checked: false,
    },
  ]);
  const [allChecked, setAllChecked] = useState(false);
  const getList = () => {
    const programUrl = axiosUrlFunction("program/all", "검색");

    axios
      .get(`${programUrl.apiUrl}`, {
        headers: {
          Authorization: `Bearer ${programUrl.token}`,
          "Content-Type": `application/json`,
        },
      })
      .then(async (res) => {
        let putData = [];
        res.data.data.map((v) => {
          putData.push({
            value: v.programKo,
            programId: v.programId,
            checked: false,
          });
        });
        setList(putData);
      })
      .catch((err) => {
          alert("시스템오류가 발생하였습니다. \n관리자에게 문의하세요.");
      });
  };

  const checkboxEventHandler = (event) => {
    const { value, checked } = event.target;

    const data = [];
    list.map((check) => {
      data.push(check);
    });

    if (checked) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].programId === parseInt(value)) {
          data[i].checked = true;
          setList(data);
        } else {
          data[i].checked = false;
        }
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].programId === parseInt(value)) {
          data[i].checked = false;
          setList(data);
          return;
        }
      }
    }
  };

  const sendList = () => {
    let data = {
      value: "",
      programId: "",
    };
    list.map((v) => {
      if (v.checked) {
        data.value = v.value;
        data.programId = v.programId;
      }
    });
    return data;
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <Modal show={true} onHide={props.onClickClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <b>프로그램 선택</b>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Col md="12">
            <Card className="card-plain table-plain-bg">
              <Card.Body className="table-full-width table-responsive px-0">
                <div style={{ height: "600px" }}>
                  <Table className="table-hover mt-0">
                    <thead>
                      <tr>
                        <td></td>
                        <td>NO</td>
                        <td>프로그램/선불권 명</td>
                      </tr>
                    </thead>
                    <tbody>
                      {list &&
                        list.map((v, i) => {
                          if (v.programId !== "") {
                            return (
                              <tr key={i}>
                                <td>
                                  {" "}
                                  <input
                                    className="cursor"
                                    type="checkbox"
                                    value={v.programId}
                                    checked={v.checked}
                                    onChange={(e) => {
                                      checkboxEventHandler(e);
                                    }}
                                  />
                                </td>
                                <td>{i + 1}</td>
                                <td>{v.value}</td>
                              </tr>
                            );
                          }
                        })}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="text-center" style={{ display: "block" }}>
        <Button
          variant="primary"
          onClick={() => props.onCompleteSelection(sendList())}
        >
          선택완료
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
