// 주차 계산
  const firstMonth = (year, month) => {
    // 마지막 달
    let lastDay = new Date(year, month, 0).getDate();
    let lastWeekCount = new Date(year, month, 0).getDate();

    // 첫달 첫 월요일
    const monday = moment(new Date(year, month - 1, 1)).day();

    let firstMonth = "";
    if (monday === 1) {
      firstMonth = 1;
    } else if (monday === 0) {
      firstMonth = 2;
    } else {
      firstMonth = 1 + 7 - (monday - 1);
      lastWeekCount -= firstMonth - 1;
    }
    const week = [];
    const weekCount = Math.ceil(lastWeekCount / 7);

    // 주차 set
    for (let i = 0; i < weekCount; i++) {
      if (firstMonth + 6 > lastDay) {
        const month2 =
          parseInt(month) + 1 === 13 ? "01" : "0" + (parseInt(month) + 1);
        const monthPlus =
          parseInt(month2) < 10 ? month2 : month2.replace("0", "");
        if (firstMonth + 6 - lastDay < 10) {
          week.push(
            `${month}월 ${i + 1}주차 (${month}-${firstMonth}~${monthPlus}-0${
              firstMonth + 6 - lastDay
            })`
          );
        } else {
          week.push(
            `${month}월 ${i + 1}주차 (${month}-${firstMonth}~${
              parseInt(month) + 1 === 13 ? "01" : month + 1
            }-${firstMonth + 6 - lastDay})`
          );
        }
      } else {
        if (firstMonth < 10 && firstMonth + 6 < 10) {
          week.push(
            `${month}월 ${i + 1}주차 (${month}-0${firstMonth}~${month}-0${
              firstMonth + 6
            })`
          );
        } else if (firstMonth < 10) {
          week.push(
            `${month}월 ${i + 1}주차 (${month}-0${firstMonth}~${month}-${
              firstMonth + 6
            })`
          );
        } else {
          week.push(
            `${month}월 ${i + 1}주차 (${month}-${firstMonth}~${month}-${
              firstMonth + 6
            })`
          );
        }
      }
      firstMonth += 7;
    }
    setWeekList(week);
  };


// 주차별 금액 출력
 const viewAmount = (name) => {
    const result = [];
    let z = 0;
    for (let i = 0; i < list.length; i++) {
      if (name === list[i].store_name) {
        for (let j = z; j < weekList.length; j++) {
          if (list[i].start !== null) {
            const content =
              list[i].calculate_check === "Y" ? "정산완료" : "정산미완료";
            const style = {
              color: list[i].calculate_check === "Y" ? "blue" : "red",
            };
            if (weekList[j].slice(9, 14) === list[i].start.slice(5, 10)) {
              result.push(<th key={uuid()}>{list[i].amount}</th>);
              result.push(
                <th
                  key={uuid()}
                  id={list[i].store_calculate_id}
                  style={style}
                  onClick={() =>
                    calculateHandler(list[i].store_calculate_id, i)
                  }
                  className="cursor"
                >
                  {content}
                </th>
              );
              z++;
              break;
            } else {
              result.push(<th key={uuid()}>0</th>);
              result.push(
                <th key={uuid()} style={{ color: "red" }}>
                  정산미완료
                </th>
              );
            }
          } else {
            result.push(<th key={uuid()}>0</th>);
            result.push(
              <th key={uuid()} style={{ color: "red" }}>
                정산미완료
              </th>
            );
          }
        }
      }
    }
