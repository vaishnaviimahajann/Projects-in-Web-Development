let btn = document.getElementById("btn");
let ps=document.getElementById("ps");
btn.addEventListener("click",generatepassword);

function generatepassword(){
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password="";
    for(let i=0;i<8;i++){
        let randomIndex = Math.floor(Math.random() * chars.length);
         password += chars[randomIndex];
    }
    ps.innerText=password;


}
