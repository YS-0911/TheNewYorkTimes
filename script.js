const date=()=>{
  let todayWeek = moment().format('dddd');
  let today = moment().format("MMM Do YY");
  document.getElementById("today").innerHTML = todayWeek, today;
}


// https://study-website-be-bbb1539aa813.herokuapp.com/ <= 이걸로 주소 바꿔야함
// api문서 확인하기: https://hackmd.io/@oW_dDxdsRoSpl0M64Tfg2g/B1D0H-JnT
const API_KEY = 'eb7d6a7c7ea74b33a9b317988f77e6b6';
let newsList = [];
const getLatestNews = async ()=>{
  const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
  // URL 인스턴스는 JS에서 필요한 함수와 변수들을 제공
  console.log(url);
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  console.log(newsList);
  render(); // newsList가 생기고 나서 함수 실행
}
getLatestNews();

const render=()=>{
  let newsHTML = ``;
  newsHTML = newsList.map(news=>`
    <div class="row news">
      <div class="col-lg-4">
        <img class="col-12" src="${news.urlToImage}" alt="">
      </div>
      <div class="col-lg-6">
        <h2>${news.title}</h2>
        <p>${news.description}</p>
        <div>${news.source.name} ${news.publishedAt}</div>
      </div>
    </div>
    `).join(''); // 배열사이에 , 지우기
  document.getElementById("news-board").innerHTML = newsHTML;
}
