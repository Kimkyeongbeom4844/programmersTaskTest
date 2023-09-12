window.onload = async () => {
  // DOM 접근
  const $loading = document.querySelector(".Loading");
  const $Nodes = document.querySelector(".Nodes");
  const $imageViewer = document.querySelector(".ImageViewer");

  // 변수들
  const apiUrl =
    "https://l9817xtkq3.execute-api.ap-northeast-2.amazonaws.com/dev";
  const imageUrl =
    "https://fe-dev-matching-2021-03-serverlessdeploymentbuck-1ooef0cg8h3vq.s3.ap-northeast-2.amazonaws.com/public";
  let data = null; //fetch data값 저장 변수
  const pathStack = [];

  // 함수들
  const showNodes = async (urlPath) => {
    try {
      $loading.style.display = "block";
      const response = await fetch(`${apiUrl}/${urlPath ? urlPath : ""}`);
      data = await response.json();
      console.log(data);
      if (data.length === 0) return;
      while ($Nodes.children.length !== 0) {
        $Nodes.removeChild($Nodes.children[0]);
      }
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          if (data[i].parent !== null) {
            $Nodes.innerHTML += `
            <div class="Node">
                <img src="./assets/prev.png">
            </div>
            `;
          }
        }
        switch (data[i].type) {
          case "DIRECTORY":
            $Nodes.innerHTML += `
            <div class="Node" data-type='DIRECTORY' data-id=${data[i].id}>
                <img src="./assets/directory.png">
                <div>${data[i].name}</div>
            </div>
            `;
            break;
          case "FILE":
            $Nodes.innerHTML += `
            <div class="Node" data-type='FILE' data-path='${data[i].filePath}'>
                <img src="./assets/file.png">
                <div>${data[i].name}</div>
            </div>
            `;
            break;
        }
      }
      for (let i = 0; i < $Nodes.children.length; i++) {
        $Nodes.children[i].addEventListener("click", async () => {
          switch ($Nodes.children[i].dataset.type) {
            case "DIRECTORY":
              console.log($Nodes.children[i].dataset.id);
              pathStack.push($Nodes.children[i].dataset.id);
              return await showNodes(pathStack[pathStack.length - 1]);
            case "FILE":
              $loading.style.display = "block";
              console.log($Nodes.children[i].dataset.path);
              const image = new Image();
              image.onload = () => {
                $loading.style.display = "none";
                $imageViewer.children[0].children[0].src = image.src;
                $imageViewer.style.display = "block";
              };
              image.src = `${imageUrl}${$Nodes.children[i].dataset.path}`;
              break;
            default:
              pathStack.pop();
              return await showNodes(pathStack[pathStack.length - 1]);
          }
        });
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      $loading.style.display = "none";
    }
  };

  // 초기세팅
  $imageViewer.style.display = "none";
  try {
    await showNodes();
  } catch (error) {
    console.log(error);
    window.location.reload();
  }

  // 이벤트들
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      $imageViewer.style.display = "none";
    }
  });

  $imageViewer.addEventListener("click", (e) => {
    console.log(e.target.tagName);
    if (e.target.tagName === "DIV") {
      $imageViewer.style.display = "none";
    }
  });
};
