window.onload = async () => {
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

  const dataArrSetting = () => {
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
  };

  const buttonColorUpdate = () => {
    for (let i = 0; i < numberButtonList.children.length; i++) {
      if (Number(numberButtonList.children[i].dataset.value) === dataArrIndex) {
        numberButtonList.children[i].style.color = "red";
      } else {
        numberButtonList.children[i].style.color = "black";
      }
    }
  };

  const buttonClickEvent = () => {
    for (let i = 0; i < buttonList.length; i++) {
      const buttonInsideText = buttonList[i].innerText;
      switch (isNaN(Number(buttonInsideText))) {
        case true:
          buttonList[i].dataset.value = buttonInsideText;
          break;
        case false:
          buttonList[i].dataset.value = Number(buttonList[i].innerText) - 1;
          break;
      }
      if (buttonList[i].dataset.hasEvent) {
        continue;
      }
      buttonList[i].dataset.hasEvent = true;
      const buttonValue = buttonList[i].dataset.value;
      buttonList[i].addEventListener("click", () => {
        switch (buttonValue) {
          case "<<":
            dataArrIndex = 0;
            break;
          case ">>":
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
  let dataArrIndex = 0;

  dataArr = [];
  dataArrSetting();

  // add Event
  showData();
  buttonClickEvent();

  dropdownSelect.addEventListener("change", (e) => {
    pagePerShow = Number(e.target.value);
    dataArr = [];
    dataArrSetting();
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
