window.onload = async () => {
  // DOM catch
  const tableBody = document.querySelector(".table_body");
  const buttonList = document.getElementsByTagName("button");
  const numberButtonList = document.querySelector(".number_button_list");
  const dropdownSelect = document.querySelector(".dropdown_select");

  // fetch data
  const response = await fetch("./src/data.json");
  const data = await response.json();
  let dataArr = [];
  let tempArr = [];
  let pagePerShow = 5;

  dataArr = [];
  for (let i = 0; i < data.length; i++) {
    tempArr.push(data[i]);
    if (tempArr.length === pagePerShow) {
      dataArr.push(tempArr);
      tempArr = [];
    }
    if (i === data.length - 1) {
      if (tempArr.length !== 0) dataArr.push(tempArr);
      tempArr = [];
    }
  }

  //functions
  const showData = () => {
    for (let j = 0; j < dataArr[dataArrIndex].length; j++) {
      tableBody.innerHTML += `
              <tr style="background-color : ${
                j % 2 === 1 ? "lightgray" : "white"
              }">
                  <td>${dataArr[dataArrIndex][j].name}</td>
                  <td>${dataArr[dataArrIndex][j].title}</td>
                  <td>${dataArr[dataArrIndex][j].email}</td>
                  <td>${dataArr[dataArrIndex][j].role}</td>
              </tr>
          `;
    }
  };

  const buttonColorUpdate = () => {
    for (let j = 0; j < numberButtonList.children.length; j++) {
      if (Number(numberButtonList.children[j].dataset.value) === dataArrIndex) {
        numberButtonList.children[j].style.color = "red";
      } else {
        numberButtonList.children[j].style.color = "black";
      }
    }
  };

  const buttonClickEvent = () => {
    for (let i = 0; i < buttonList.length; i++) {
      const buttonValue = buttonList[i].dataset.value;
      buttonList[i].addEventListener("click", () => {
        console.log(111);
        switch (buttonValue) {
          case "prev":
            dataArrIndex = 0;
            break;
          case "next":
            dataArrIndex = dataArr.length - 1;
            break;
          default:
            dataArrIndex = Number(buttonValue);
            break;
        }
        // console.log(dataArrIndex)
        buttonColorUpdate();
        tableBody.innerHTML = ``;
        showData();
      });
    }
  };

  // add Event
  let dataArrIndex = 0;
  showData();
  buttonClickEvent();

  dropdownSelect.addEventListener("change", (e) => {
    pagePerShow = Number(e.target.value);
    dataArr = [];
    for (let i = 0; i < data.length; i++) {
      tempArr.push(data[i]);
      if (tempArr.length === pagePerShow) {
        dataArr.push(tempArr);
        tempArr = [];
      }
      if (i === data.length - 1) {
        if (tempArr.length !== 0) dataArr.push(tempArr);
        tempArr = [];
      }
    }
    // console.log(dataArr);
    numberButtonList.innerHTML = ``;
    for (let i = 0; i < dataArr.length; i++) {
      numberButtonList.innerHTML += `
              <button data-value=${i}>${i + 1}</button>
          `;
    }
    dataArrIndex = 0;
    buttonColorUpdate();
    tableBody.innerHTML = ``;
    showData();
    buttonClickEvent();
  });
};
