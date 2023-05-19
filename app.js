//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist"
})
const item2 = new Item({
  name: "Hello kumi now"
})
const item3 = new Item({
  name: "Wow u got dit"
})

const defultItems = [item1,item2,item3];
  
const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema)



  app.get("/", async function(req, res) {
    try {
      const foundItems = await Item.find({});
      if (foundItems.length ===0) {
          Item.insertMany(defultItems)
          .then(function () {
            console.log("Successfully saved defult items to DB");
          })
          .catch(function (err) {
            console.log(err);
          });
          res.redirect("/");
      } else {
        res.render("list", { listTitle: "Today", newListItems: foundItems });
      }
      
    } catch(err) {
      console.log("Error:", err);
    }
  });

  app.get("/:customListName", (req,res) => {
    const customListName = req.params.customListName

    const list = new List ({
      name: customListName,
      items: defultItems
    })

    list.save();
  })
  


app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name:itemName
  })
  
  item.save();
  res.redirect("/");
});



app.post("/delete", async (req,res) => {
  const checkedItemId = req.body.checkbox;

  try {
    await Item.findByIdAndRemove(checkedItemId);
    console.log("successfully deleted checked item");
    res.redirect("/")
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
  
})




app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
