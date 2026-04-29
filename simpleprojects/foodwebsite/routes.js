

const express = require("express")
const router = express.Router()

const menu = [
{ id:1, name:"Burger", price:120 },
{ id:2, name:"Pizza", price:250 },
{ id:3, name:"Pasta", price:180 },
{ id:4, name:"Sandwich", price:90 },
{ id:5, name:"French Fries", price:110 },
{ id:6, name:"Cold Coffee", price:150 }
]

router.get("/menu",(req,res)=>{
res.json(menu)
})

router.post("/order",(req,res)=>{
const order = req.body
console.log("Order Received",order)

res.json({
message:"Order placed successfully"
})
})

module.exports = router