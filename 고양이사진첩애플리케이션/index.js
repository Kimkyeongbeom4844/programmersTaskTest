window.onload = async () => {
  // DOM 접근
  const $loading = document.querySelector(".Loading");
  const $Nodes = document.querySelector(".Nodes");
  const $imageViewer = document.querySelector(".ImageViewer");
  const $breadcrumb = document.querySelector(".Breadcrumb");

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
      const response = await fetch(`${apiUrl}/${urlPath ? urlPath : ""}`); // 502오류가 뜨는데 이거 문의해야되나..
      data = await response.json();
      while ($breadcrumb.children.length > 1) {
        $breadcrumb.removeChild(
          $breadcrumb.children[$breadcrumb.children.length - 1]
        );
      }
      for (let i = 0; i < pathStack.length; i++) {
        $breadcrumb.innerHTML += `
          <div>${pathStack[i].name}</div>
        `;
      }
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
            <div class="Node" data-type='DIRECTORY' data-id=${data[i].id} data-name=${data[i].name}>
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
              pathStack.push({
                name: $Nodes.children[i].dataset.name,
                id: $Nodes.children[i].dataset.id,
              });
              await showNodes(pathStack[pathStack.length - 1].id);
              break;
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
              await showNodes(pathStack?.[pathStack.length - 1]?.id);
              break;
          }
        });
      }
    } catch (error) {
      console.log(error);
      window.location.reload();
    } finally {
      $loading.style.display = "none";
    }
  };

  // 초기세팅
  $imageViewer.style.display = "none";
  await showNodes();

  // 이벤트들
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      $imageViewer.style.display = "none";
    }
  });

  $imageViewer.addEventListener("click", (e) => {
    if (e.target.tagName === "DIV") {
      $imageViewer.style.display = "none";
    }
  });
};
