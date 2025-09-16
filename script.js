// https://study-website-be-bbb1539aa813.herokuapp.com/ <= 이걸로 주소 바꿔야함
// api문서 확인하기: https://hackmd.io/@oW_dDxdsRoSpl0M64Tfg2g/B1D0H-JnT
const API_KEY = 'eb7d6a7c7ea74b33a9b317988f77e6b6';
let news = [];
const getLatestNews = async ()=>{
  const url = new URL(`https://study-website-be-bbb1539aa813.herokuapp.com/top-headlines?country=us&apiKey=${API_KEY}`);
  // URL 인스턴스는 JS에서 필요한 함수와 변수들을 제공
  console.log(url);
  const response = await fetch(url);
  const data = await response.json();
  news = data.articles;
  console.log(news);
}
getLatestNews();