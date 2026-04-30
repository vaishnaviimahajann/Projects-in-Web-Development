const express = require("express")
const router = express.Router()

let appointments = []

// get all appointments
router.get("/appointments",(req,res)=>{
res.json(appointments)
})

// book appointment
router.post("/book",(req,res)=>{

const appointment = req.body

appointments.push(appointment)

res.json({
message:"Appointment booked successfully",
data:appointment
})

})

module.exports = router