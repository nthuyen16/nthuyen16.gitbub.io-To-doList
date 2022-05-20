const listnote = document.querySelector(".list");
const APIGET = "http://localhost:8070/todo/ghichu/list";
const API_ADD_CHANGE = "http://localhost:8070/todo/ghichu/save";
const API_DELETE = "http://localhost:8070/todo/ghichu/delete";
let mode = {
  id:"",
  flag: false
};
//1.xem
//load trang laay du lieu
function getNote(callback) {
  fetch(APIGET)
    .then(function (respon) {
      return respon.json(); //convert to js
    })
    .then(callback);
}
//render ra du lieu
function renderData(notelist) {
  let html = notelist.map(function (note) {
    return `<li class="item">${note.title} - ${note.ghiChu} <div>
    <span onclick="deletenote(${note.id});">Xóa</span>
    <span onclick="handleChange(${note.id});">Sửa</span></div></li>
    `;
  });
  listnote.innerHTML = html.join("");
}

//them du lieu
function addTodo(data) {
  fetch(API_ADD_CHANGE, {
    method: "POST",
    
    body: JSON.stringify(data),//convert thành json
     
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
})
.then(function (respon) {
  return respon.json();
})
.then(function(){
  getNote(renderData);
});
document.querySelector("#input").value = "";
document.querySelector("#ghichu").value = "";
}

//xoa du lieu
function deletenote(id) {
  //khi onclik thi se goi ham nay 
  fetch(API_DELETE,{
    method: "POST",
    
    body: JSON.stringify([id]),
     
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(function (respon) {
    return respon.json();
  })
  .then(function(){
    getNote(renderData);
  });
}
//put dữ liệu muốn sửa lên input,bật mode sửa lên,gán id vào mode
function handleChange(id){
  mode.flag = true;
  mode.id = id
  if(mode.flag === true){
    const button = document.querySelector("#button");
    button.innerHTML = "<span>Update</span>"
  }
  fetch(`http://localhost:8070/todo/ghichu/${id}`)
  .then(function(res){
    return res.json();
  })
  .then(function(note){
     document.querySelector("#input").value = note.title;
    document.querySelector("#ghichu").value = note.ghiChu;
  })
}

//lây dữ liệu trên input sau khi sửa,truyền vào body kèm id trong mode
//sau khi update xong tắt mode quay lại button là chức năng thêm
function UpdateData(data){
  fetch(API_ADD_CHANGE,{
    method: "POST",
    
    body: JSON.stringify(data),
     
    headers: {
        "Content-type": "application/json; charset=UTF-8" //convert to json
    }
  }).then(function(res){
    return res.json;
  })
  .then(function(){
    getNote(renderData)
  })
  mode.flag = false;
  button.innerHTML = "<span>Add</span>"
  document.querySelector("#input").value ="";
  document.querySelector("#ghichu").value = "";
}
//lay du lieu tren input truyen vao body 
const button = document.querySelector("#button");
button.addEventListener("click",(e)=>{
e.preventDefault();
const valueName = document.querySelector("#input").value;
const ghichu = document.querySelector("#ghichu").value;
const data = {
  id :mode.flag ? mode.id : null,//nếu bật mode thì lấy id còn không thì null
  title :valueName,
  meta:"",
  ghiChu : ghichu,
  status : 0,
  body :""
}
  if(mode.flag === true){
    UpdateData(data)
  }
  else{
    addTodo(data);
  }
})
//khoi dong app
function start() {
  getNote(renderData);
}

start();
