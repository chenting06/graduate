export function countScrollDistance() {
  console.log("监听到滚动，改变底部距离");
  // alert("绑定事件并监听");
  // 变量 scrollHeight 是滚动条的总高度
  let scrollHeight =
    document.documentElement.scrollHeight || document.body.scrollHeight;

  // 变量 windowHeight 是可视区的高度
  let windowHeight =
    document.documentElement.clientHeight || document.body.clientHeight;

  // 变量scrollTop为当前页面的滚动条纵坐标位置
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  // 滚动条到底部得距离 = 滚动条的总高度 - 可视区的高度 - 当前页面的滚动条纵坐标位置
  let scrollBottomTemple = scrollHeight - windowHeight - scrollTop;
  return scrollBottomTemple;
}
