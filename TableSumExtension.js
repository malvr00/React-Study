// 할인 전 · 된 금액
        const price = new Array(3);
        for (let i = 0; i < price.length; i++) {
          price[i] = new Array(
            new Date(selectedYear, selectedMonth, 0).getDate() + 1
          ).fill(0);
        }
        price[0][0] = "할인전 금액";
        price[1][0] = "할인된 금액";
        price[2][0] = "실제 일매출";

        // 일별 매출
        const listname = new Array(res.data.data[0].total_count);
        listname[0] = new Array(
          new Date(selectedYear, selectedMonth, 0).getDate() + 1
        );
        listname[0].fill(0);
        listname[0][0] = res.data.data[0].name;

        let j = 1;
        for (let i = 0; i < res.data.data.length; i++) {
          if (listname[j - 1][0] !== res.data.data[i].name) {
            listname[j] = new Array(
              new Date(selectedYear, selectedMonth, 0).getDate() + 1
            );
            listname[j].fill(0);
            listname[j][0] = res.data.data[i].name;
            j++;
          }
        }

        // 일별 매출
        for (let i = 0; i < listname.length; i++) {
          for (let j = 0; j < res.data.data.length; j++) {
            if (listname[i] !== undefined) {
              if (listname[i][0] === res.data.data[j].name) {
                if (res.data.data[j].created_at !== null) {
                  if (res.data.data[j].created_at.substring(8, 9) === "0") {
                    listname[i][res.data.data[j].created_at.substring(9, 10)] +=
                      res.data.data[j].total_amount;
                  } else {
                    listname[i][res.data.data[j].created_at.substring(8, 10)] +=
                      res.data.data[j].total_amount;
                  }
                }
              }
            }
          }
        }

        // 할인 전 · 된 금액
        for (let i = 0; i < price.length; i++) {
          for (let j = 0; j < res.data.data.length; j++) {
            if (res.data.data[j].created_at !== null) {
              if (i === 0) {
                if (res.data.data[j].created_at.substring(8, 9) === "0") {
                  price[i][res.data.data[j].created_at.substring(9, 10)] =
                    res.data.data[j].price;
                } else {
                  price[i][res.data.data[j].created_at.substring(8, 10)] =
                    res.data.data[j].price;
                }
              } else if (i === 1) {
                if (res.data.data[j].created_at.substring(8, 9) === "0") {
                  price[i][res.data.data[j].created_at.substring(9, 10)] =
                    res.data.data[j].discount_price;
                } else {
                  price[i][res.data.data[j].created_at.substring(8, 10)] =
                    res.data.data[j].discount_price;
                }
              }
            }
            if (i === 2) {
              if (j < new Date(selectedYear, selectedMonth, 0).getDate() + 1) {
                if (j === 0) continue;
                else {
                  price[i][j] = price[0][j] - price[1][j];
                }
              } else {
                break;
              }
            }
          }
        }
