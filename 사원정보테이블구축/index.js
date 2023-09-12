window.onload = async () => {
  // 호이스팅으로 인한 TDZ로 인해 let, const로 선언된 변수, 함수둘 코드 최상단으로 이동
  // fetch 및 변수
  const data = await (await fetch("./src/data.json")).json();
  let dataArr = [];
  let pagePerShow = 5;
  let dataArrIndex = 0;

  // 함수들
  const showTable = () => {
    tableBody.innerHTML = ``;
    for (let j = 0; j < dataArr[dataArrIndex].length; j++) {
      tableBody.innerHTML += `
        <tr style="background-color : ${j % 2 === 1 ? "lightgray" : "white"}">
            <td>${dataArr[dataArrIndex][j].name}</td>
            <td>${dataArr[dataArrIndex][j].title}</td>
            <td>${dataArr[dataArrIndex][j].email}</td>
            <td>${dataArr[dataArrIndex][j].role}</td>
        </tr>
      `;
    }
  };

  const updateDataArr = () => {
    dataArr = [];
    let tempArr = [];
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
        buttonColorUpdate();
        showTable();
      });
    }
  };

  // DOM 접근
  const tableBody = document.querySelector(".table_body");
  const buttonList = document.getElementsByTagName("button");
  const numberButtonList = document.querySelector(".number_button_list");
  const dropdownSelect = document.querySelector(".dropdown_select");

  // 초기세팅
  updateDataArr();
  showTable();
  buttonClickEvent();

  // 이벤트들
  dropdownSelect.addEventListener("change", (e) => {
    pagePerShow = Number(e.target.value);
    updateDataArr();
    while (numberButtonList.children.length) {
      numberButtonList.removeChild(numberButtonList.children[0]);
    }
    for (let i = 0; i < dataArr.length; i++) {
      numberButtonList.innerHTML += `
        <button data-value=${i}>${i + 1}</button>
      `;
    }
    dataArrIndex = 0;
    buttonColorUpdate();
    showTable();
    buttonClickEvent();
  });
};
