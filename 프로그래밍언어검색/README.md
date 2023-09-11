# 프로그래밍언어검색

## 💬 MEMO

```
 - 지난 사원정보테이블구축 때와 동일하게 addEventListener로 발생하는 메모리 누수가 재발

 - createElement를 사용하여 미리 한번에 DOM을 완성한 후 append시켜 DOM 업데이트를 줄일 수 있다

 - remove() 또는 removeChild() 메소드를 사용하여 DOM 제거 시 자동적으로 해당 DOM에 달려있는 이벤트가 제거되므로 따로 removeEventListener를 호출할 필요가 없다.
 하지만 innerHTML = ""; 을 사용하여 DOM을 제거할 경우 이벤트 리스너가 메모리에 남아있으므로 항상 뒷마무리로 removeEventListener를 호출해주자
```

![이벤트메모리관리이미지1](https://file.notion.so/f/f/e8d8ad32-680e-43dd-a515-2e167b723cbb/07134533-c181-4d6e-bd76-49e15b234cbf/Untitled.png?id=6821a3c6-6d8f-46b5-847a-1f11068a531c&table=block&spaceId=e8d8ad32-680e-43dd-a515-2e167b723cbb&expirationTimestamp=1694512800000&signature=6SLHfM0agBQwT45t7228QUvVRRPBb4CvVZSzwK3DtEY&downloadName=Untitled.png)
![이벤트메모리관리이미지2](https://file.notion.so/f/f/e8d8ad32-680e-43dd-a515-2e167b723cbb/57b9080f-d863-4f08-9b0b-f53fdb41a5da/Untitled.png?id=da9dfe28-db8e-4068-aaec-f4c00a5cb943&table=block&spaceId=e8d8ad32-680e-43dd-a515-2e167b723cbb&expirationTimestamp=1694512800000&signature=CkLie_pf_flbluMhjAKKVZYYlTGXXx6pHj7-I9t24NM&downloadName=Untitled.png)
