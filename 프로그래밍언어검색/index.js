window.onload = async () => {
  // DOM 접근
  const $SearchInput = document.querySelector(".SearchInput");
  const $SearchInput__input = document.querySelector(".SearchInput__input");
  const $Suggestion = document.querySelector(".Suggestion");
  const $SelectedLanguage = document.querySelector(".SelectedLanguage");

  // 인풋자동포커스
  $SearchInput__input.focus();

  // 변수들
  let isSelectMode = false;
  let wordArr = [];
  let wordArrIndex = 0;
  let selectList = new Set();
  const selectListMax = 5;
  const baseUrl =
    "https://wr4a6p937i.execute-api.ap-northeast-2.amazonaws.com/dev";

  // 함수들
  const suggestionDisplayFunction = () => {
    if ($Suggestion.children.length === 0) {
      $Suggestion.style.display = "none";
    } else {
      $Suggestion.style.display = "block";
    }
  };

  const updateSelectList = (value) => {
    $SelectedLanguage.children[0].innerHTML = ``;
    if (selectList.has(value)) {
      selectList.delete(value);
    }
    selectList.add(value);
    const selectListArr = [...selectList];
    if (selectListArr.length > selectListMax) {
      selectListArr.shift();
      selectList = new Set([...selectListArr]);
    }
    for (let i = 0; i < selectListArr.length; i++) {
      $SelectedLanguage.children[0].innerHTML += `
        <li>${selectListArr[i]}</li>
      `;
    }
  };

  const clear$Suggestion = () => {
    if ($Suggestion.children.length !== 0) {
      while ($Suggestion.children[0].children.length) {
        $Suggestion.children[0].removeChild(
          $Suggestion.children[0].children[0]
        );
      }
      $Suggestion.children[0].remove();
    }
  };

  // 초기 실행
  suggestionDisplayFunction(); // 초기 1회 호출 후 $Suggestion style 결정

  // 이벤트들
  $Suggestion.addEventListener("click", (e) => {
    if (/^li$/i.test(e.target.tagName)) {
      alert(e.target.innerHTML);
      updateSelectList(e.target.innerHTML);
    }
    $SearchInput__input.focus();
  });

  $SearchInput.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $SearchInput__input.addEventListener("keyup", async (e) => {
    try {
      console.log(e);

      switch (e.key) {
        case "ArrowUp":
          if (isSelectMode === true) {
            if (wordArrIndex > 0) {
              wordArrIndex--;
            }
          }
          break;
        case "ArrowDown":
          if (isSelectMode === true) {
            if (wordArrIndex < wordArr.length - 1) {
              wordArrIndex++;
            }
          }
          break;
        case "Enter":
          if ($Suggestion.children.length !== 0) {
            if (isSelectMode === true) {
              alert(wordArr[wordArrIndex]);
              updateSelectList(wordArr[wordArrIndex]);
            } else {
              isSelectMode = true;
            }
          }
          break;
        default:
          isSelectMode = false;
          wordArrIndex = 0;
          const inputData = $SearchInput__input.value;
          // $Suggestion.innerHTML = "";
          clear$Suggestion();
          if (inputData.length !== 0) {
            const response = await fetch(
              `${baseUrl}/languages?keyword=${inputData}`
            );
            const data = await response.json();
            // console.log(data);
            wordArr = [];
            clear$Suggestion();
            if (data.length === 0) return;
            const $ul = document.createElement("ul");
            for (let i = 0; i < data.length; i++) {
              wordArr.push(data[i]);
              $ul.innerHTML += `
                <li>${data[i]}</li>
              `;
            }
            // console.log($ul);
            $Suggestion.appendChild($ul);
          }
          break;
      }
    } catch (error) {
      console.log(error);
    } finally {
      suggestionDisplayFunction();
      if ($Suggestion.children.length !== 0) {
        for (let i = 0; i < $Suggestion.children[0].children.length; i++) {
          if (i === wordArrIndex) {
            $Suggestion.children[0].children[i].classList.add(
              "Suggestion__item--selected"
            );
          } else {
            $Suggestion.children[0].children[i].classList.remove(
              "Suggestion__item--selected"
            );
          }
        }
      }
    }
  });
};
