// Scenario
// You're tasked with building the backend for a campus Lost & Found system. Security staff or students can log found items, and users can view, update, and manage those entries.





// Requirements:

// 1.Set up Node.js + Express + MongoDB



// 2.Create an Item model:

// itemName (String)
// description (String)
// locationFound (String)
// dateFound (Date)
// claimed (Boolean)


// 3.Implement CRUD operations:




// Update an item’s details or mark as claimed



require('dotenv').config();
const express = require("express")
const mongoose = require("mongoose")
const Item = require("./Item_model.js")
const app = express()
app.use(express.json())

const MONGODB_URL = process.env.DATABASE_URL

const PORT = process.env.PORT


mongoose.connect(MONGODB_URL)
.then(()=> {console.log("mongodb connected...");
    app.listen(PORT, () =>{console.log(`Server started running at port:${PORT}...`)})
})


// Add a found item
app.post("/add-found-item/", async(request, response)=>{
    const {itemName,description,locationFound,dateFound,claimed} = request.body
    if (!itemName && !description){
        return response.status(400).json({message:"Please enter required fields"})
    }
    const foundItem = new Item({itemName,description,locationFound,dateFound,claimed})
    await foundItem.save()

    response.status(201).json({
        message:"success",
        foundItem
    })
    
})

// View all unclaimed items
app.get("/unclaimed-items", async(request, response)=>{
    const unclaimedItems = await Item.find({claimed:false})
    response.status(200).json({message: "successful",unclaimedItems})
})

// View one item by ID
app.get("/one-item/:id", async(request,response)=>{
    const {id} = request.params
    const oneItem = await Item.findById(id) 
    if (!oneItem){
        return response.status(404).json({message:"item does not exist"})
    }
    response.status(200).json({
        message:"success",
        oneItem})
})

// Update an item’s details or mark as claimed
app.patch("/update-item/:id", async(request,response)=>{
    
    const {id} = request.params
    const {claimed } = request.body
    
    const itemForUpdate = await Item.findById(id)
    if (itemForUpdate){
        itemForUpdate.claimed = claimed
        await itemForUpdate.save()

        return response.status(200).json({
            message:"item successfully updated",
            itemForUpdate
    })
    }
    else { response.status(404).json({message:"item does not exist"})}
    
})

// Delete old/irrelevant entries
app.delete("/delete-items/:id", async (request, response)=>{
    const{id} = request.params
    const deletedItems = await Item.findByIdAndDelete(id)
    response.status(200).json({message:"success"})
})