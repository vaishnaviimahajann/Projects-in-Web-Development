let btn = document.getElementById("btn");
let author = document.getElementById("author");


btn.addEventListener("click",getquote);

async function getquote(){
    let url = "https://dummyjson.com/quotes/random";

    let response =await fetch(url);
    let data=await response.json();
    console.log(data); // debugging

    document.getElementById("quote-text").innerText = data.quote;
    document.getElementById("author").innerText = "- " + data.author;


}