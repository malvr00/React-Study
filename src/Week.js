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
