const express = require("express")
const router = express.Router()

let slots = [
{ id:1, status:"available" },
{ id:2, status:"occupied" },
{ id:3, status:"available" },
{ id:4, status:"available" },
{ id:5, status:"occupied" },
{ id:6, status:"available" }
]

// get all slots
router.get("/slots",(req,res)=>{
res.json(slots)
})

// book slot
router.post("/book/:id",(req,res)=>{

const id = parseInt(req.params.id)

let slot = slots.find(s=>s.id===id)

if(slot && slot.status==="available"){
slot.status="occupied"
res.json({message:"Slot booked"})
}else{
res.json({message:"Slot not available"})
}

})

// free slot
router.post("/free/:id",(req,res)=>{

const id = parseInt(req.params.id)

let slot = slots.find(s=>s.id===id)

if(slot){
slot.status="available"
res.json({message:"Slot freed"})
}

})

module.exports = router