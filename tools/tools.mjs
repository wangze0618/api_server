export const getTime = () => {
  let date = new Date();
  let zeroFill = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  let Year = date.getFullYear();
  let Mon = date.getMonth() + 1;
  let Day = date.getDate();
  let Hour = date.getHours();
  let Min = zeroFill(date.getMinutes());
  let Sec = zeroFill(date.getSeconds());

  return `${Year}年${Mon}月${Day}日 ${Hour}时${Min}分${Sec}秒`;
};
