interface ArrItem {
  uid: string | number;
}

export default function arrDiff(arr: ArrItem[]): ArrItem[] {
  const newArr: ArrItem[] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i].uid == arr[j].uid) {
        ++i;
      }
    }
    newArr.push(arr[i]);
  }
  return newArr;
}
