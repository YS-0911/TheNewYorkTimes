const API_KEY = 'eb7d6a7c7ea74b33a9b317988f77e6b6';
let urlSample1 = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
// <= 원래 주소
let urlSample2 = `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&apiKey=${API_KEY}`
// <= 이걸로 주소 바꿔야함
// api문서 확인하기: https://hackmd.io/@oW_dDxdsRoSpl0M64Tfg2g/B1D0H-JnT
const inputBox = document.getElementById("input-box");
const inputBtn = document.getElementById("input-btn");
const iconBtn = document.getElementById("icon-btn");
iconBtn.addEventListener("click",()=>{
  if(inputBtn.style.display == "none"){
    inputBox.style.display = "block";
    inputBtn.style.display = "block";
  }else{
    inputBox.style.display = "none";
    inputBtn.style.display = "none";
  }
});

let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

let newsList = [];
let currentUrl = null;

const menuArea = document.getElementById("menu");
const openMenu = document.getElementById("open-menus");
openMenu.addEventListener("click",()=>{
  menuArea.style.display = "flex";
});
const closeMenu = document.getElementById("close-menus");
closeMenu.addEventListener("click",()=>{
  menuArea.style.display = "none";
});

const menus = document.querySelectorAll(".menus button")
menus.forEach(menus=>menus.addEventListener("click",(event)=>{getNewsByCategory(event)}));

const getNews=async(url)=>{
  try{
    if(url) currentUrl = url;
    currentUrl.searchParams.set("page",page); // -> &page=page

    const response = await fetch(currentUrl);
    const data = await response.json();
    console.log(data);
    if(response.status == 200){
      if(data.articles.length == 0) throw new Error("No matches for your search");
      newsList = data.articles;
      totalResults = data.totalResults;
      render(); // newsList가 생기고 나서 함수 실행
      pagiNationRender();
    }else{
      throw new Error(data.message);
    }
  }catch(error){
    errorRender(error.message);
  }
}

const getNewsByCategory=(event)=>{
  page = 1;
  const category = event.target.textContent.toLowerCase();
  const url = new URL(`${urlSample2}&category=${category}`);
  getNews(url);
}

const getLatestNews =()=>{
  const url = new URL(`${urlSample2}`);
  // URL 인스턴스는 JS에서 필요한 함수와 변수들을 제공
  getNews(url);
}

const getNewsByKeyword = () => {
  const keyword = document.getElementById("input-box").value;
  const url = new URL(`${urlSample2}&q=${keyword}`);
  getNews(url);
}

const render=()=>{
  let newsHTML = ``;
  newsHTML = newsList.map(news=>`
    <div class="row news">
      <div class="col-lg-5">
        <img class="col-12" src="${
          news.urlToImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
        }">
      </div>
      <div class="col-lg-7">
        <h2>${news.title}</h2>
        <p>${
          news.description == null || news.description == ""
          ? "내용없음"
          : news.description.length > 200
          ? news.description.substring(0, 200) + "..."
          : news.description
        }</p>
        <div>${news.source.name || "no source"} | ${moment(news.publishedAt).fromNow()}</div>
      </div>
    </div>
    `).join(''); // 배열사이에 , 지우기
  document.getElementById("news-board").innerHTML = newsHTML;
}

const date=()=>{
  let todayWeek = moment().format('dddd');
  let today = moment().format("LL");
  document.getElementById("today").innerHTML = `${todayWeek}, ${today}`;
}
date();

const errorRender=(errorMessage)=>{
  const errorHtml = `
    <div class="alert alert-danger error" role="alert">
      ${errorMessage}
    </div>
  `;

  document.getElementById("news-board").innerHTML = errorHtml;
}

const pagiNationRender=()=>{
  // totalPages
  const totalPages = Math.ceil(totalResults / pageSize);
  // pageGroup
  const pageGroup = Math.ceil(page / groupSize);
  // lastPage
  let lastPage = pageGroup * groupSize;
  if(lastPage > totalPages){
    lastPage=totalPages;
  }
  // firstPage
  const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
  
  let pagiNationHTML = ``;

  if(page != 1){
    if(page > 2){
      pagiNationHTML += `<li class="page-item"><a class="page-link" onclick="moveToPage(${1})" href="#"><i class="fa-solid fa-angles-left"></i></a></li>`;
    }
    pagiNationHTML += `<li class="page-item"><a class="page-link" onclick="moveToPage(${page-1})"   href="#"><i class="fa-solid fa-angle-left"></i></a></li>`;
  }

  for(let i=firstPage;i<=lastPage;i++){
    pagiNationHTML+=`<li class="page-item ${i === page ? 'active' : ''}" onclick="moveToPage(${i})"><a class="page-link" href="#">${i}</a></li>`;
  }
  
  if(page != lastPage){
    pagiNationHTML += `<li class="page-item"><a class="page-link" onclick="moveToPage(${page+1})" href="#"><i class="fa-solid fa-angle-right"></i></a></li>`;
    if(page < lastPage-1){
      pagiNationHTML += `<li class="page-item"><a class="page-link" onclick="moveToPage(${lastPage})" href="#"><i class="fa-solid fa-angles-right"></i></a></li>`;
    }
  }

  document.querySelector(".pagination").innerHTML = pagiNationHTML
}

const moveToPage=(pageNumber)=>{
  page = pageNumber;
  getNews();
}

getLatestNews();