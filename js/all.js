//取得目前 id的最大值(暫存id值)
let tempId = 0;

//套票卡片區塊
const ticketCardArea = document.querySelector('#ticketCardArea');

// 新增旅遊套票功能
const ticketName = document.querySelector("#ticketName");
const ticketImgUrl = document.querySelector("#ticketImgUrl");
const ticketLocation = document.querySelector("#ticketLocation");
const ticketPrice = document.querySelector("#ticketPrice");
const ticketNum = document.querySelector("#ticketNum");
const ticketRate = document.querySelector("#ticketRate");
const ticketDescription = document.querySelector("#ticketDescription");
const btnAddTicket = document.querySelector("#btnAddTicket");

//下拉選單-地區搜尋
const locationSearch = document.querySelector("#locationSearch");
//本次搜尋共幾筆資料
const countsSearchResult = document.querySelector("#countsSearchResult");

//查無資料區塊
const cantFindArea = document.querySelector(".cantFind-area");

let data = []; //宣告一個存放資料的陣列

// 初始化
function init(){
  getData(); //取得旅遊景點資料
}
init();

//取得旅遊景點資料
function getData(){
  // 透過axios串接API，取得JSON格式資料
  axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
    .then(function(response){
      // console.log(response.data.data);
      data = response.data.data;
      renderData(data); //渲染畫面到網頁上
    })
    .catch(function(error){
      console.log(error);
    })
}


//渲染 卡片資料到網頁上
function renderData(data){
  let str = "";
  if(data.length == 0){
    cantFindArea.style.display = "block";  //查無資料區塊-顯示
  }else{
    cantFindArea.style.display = "none";   //查無資料區塊-隱藏
    data.forEach((item, index) => {
      //設定 tempId 做為新增資料使用
      if(item.id > tempId){
        tempId = item.id;
      }
      //組HTML字串
      str += `<li class="ticket-card">
      <div class="ticket-card-img mb-5">
        <a href="#">
          <img src=${item.imgUrl} alt="photo-travel">                
        </a>
        <div class="ticket-card-location fs-m px-5 py-2">${item.area}</div>
        <div class="ticket-card-rank px-2 py-1">${item.rate}</div>
      </div>
      <div class="ticket-card-content d-flex flex-column justify-content-between px-5">
        <div>
          <h2 class="fs-l fw-medium text-primary mb-4">${item.name}</h2>
          <p class="mb-8 text-gray-dark">
            ${item.description}
          </p>
        </div>
        <div class="d-flex justify-content-between align-items-center text-primary mb-4">
          <p class="fw-medium">
            <span class="material-icons-outlined mr-1">
              error
            </span>
            剩下最後 ${item.group} 組
          </p>
          <div class="d-flex align-items-center">
            <span class="fw-medium mr-1">TWD</span>
            <span class="fs-xl fw-medium">$${separator(item.price)}</span>
          </div>
        </div>
      </div>
    </li>`;
    })
  }
  ticketCardArea.innerHTML = str;
  countsSearchResult.textContent = `本次搜尋共 ${data.length} 筆資料`;
}

//監聽 新增套票按鈕 綁定 click 監聽事件
btnAddTicket.addEventListener('click',(e) =>{
  let arrInputs = [  //存放表單DOM變數
    ticketName,
    ticketImgUrl,
    ticketLocation,
    ticketPrice,
    ticketNum,
    ticketRate,
    ticketDescription
  ]
  //檢查欄位
  let chkMsg = chkFormValue(arrInputs);
  if(chkMsg != "") { //若有驗證不過的訊息，alert提醒
    alert(chkMsg);
  } else {
    let obj = {}; //宣告一個物件，用來存放新增的套票內容
    obj.id = ++tempId;
    obj.name = ticketName.value;
    obj.imgUrl = ticketImgUrl.value;
    obj.area = ticketLocation.value;
    obj.description = ticketDescription.value;
    obj.rate = ticketRate.value;
    obj.group = ticketNum.value;
    obj.price = separator(ticketPrice.value); //數字三位一撇(如 1,000)
    obj.isTimeLimit = false;
    data.push(obj);
    renderData(data);
  }
})

//監聽 下拉選單-地區搜尋, 綁定 change 監聽事件
locationSearch.addEventListener('change', (e)=>{
  // console.log(e.target.value);
  // 取出 option 內的 value 值
  if(e.target.value == "全部地區") {
    renderData(data);
  } else {
    let filterData = data.filter((item, index) =>{
      return item.area == e.target.value;
    })
    renderData(filterData);
  }
})

//檢查、驗證新增套票的input欄位是否符合要求
function chkFormValue(arrInputs, chkMsg){
  let str = "";
  arrInputs.forEach((item, index)=>{
    if(item.value == "") {
      str += `欄位【${item.name}】不可空白，請填寫。\n`;
    } else {
      if(item.name == "套票星級" && !(parseInt(item.value)>0 && parseInt(item.value)<=10)) {
        str += `【套票星級】請輸入數值:1~10\n`;
      } else if(item.name == "套票組數" && parseInt(item.value) <=0 ) {
        str += `【套票組數】請輸入大於0數值\n`;
      } else if(item.name == "套票金額" && parseInt(item.value) <=0) {
        str += `【套票金額】請輸入大於0數值\n`;
      } else if(item.name == "套票描述" && parseInt(item.value.length) > 80) {
        str += `【套票描述】的字數不可以超過80個字，請重新確認。\n`;
      }
    }
  })
  return str;
}

//數字 三位一撇
function separator(numb) {
  var str = numb.toString().split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
}