const fs = require('fs');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Connnect to DB
const uri = "mongodb+srv://s6604062630269:AAiLyUmiSfY2x7wz@firstdb1.znhbjdp.mongodb.net/?retryWrites=true&w=majority&appName=Firstdb1";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Create Api
const app = express();
app.use(cors())
app.use(express.json());
app.use((req, res, next) => {
  console.log(`\x1b[34m Endpoint: ${req.originalUrl} | Method: ${req.method} \x1b[0m`);
  next();
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.post("/addBook", upload.single('imgName'), async (req, res) => {
  const filename = req.file?.filename;
  if (!filename) {
    res.status(400).json({
      status: "fail",
      message: "No file uploaded."
    });
    return
  }

  try {
    const { title, description, price, tags } = req.body;
    const books = client.db("website1").collection("books");

    if (!title) {
      throw new Error("No Title.");
    } else if (!description) {
      throw new Error("No Description.");
    }

    const query = {
      title: title,
      description: description,
      imgName: filename,
      price: Number(price),
      tags: JSON.parse(tags)
    }

    await books.insertOne(query);
    res.status(200).json({
      status: "success"
    });

  } catch (err) {
    if (req.file?.filename) {
      const imgPath = path.join(__dirname, 'uploads', filename);
      fs.unlink(imgPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Failed to delete uploaded image:", unlinkErr);
        // } else {
        //   console.log("Successfully deleted uploaded image");
        }
      });
    }

    if (err.message === "No Title.") {
      res.status(400).json({
        status: "fail",
        message: "No Title."
      });
    } else if (err.message === "No Description.") {
      res.status(400).json({
        status: "fail",
        message: "No Description."
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Error with database."
      });
    }
  }
});

app.get("/deleteBook", async (req, res) => {
  const { id } = req.query;
  const books = client.db("website1").collection("books");
  const query = { _id: new ObjectId(id)};

  try {
    await books.findOneAndDelete(query);

    res.status(200).json({
      status: "success",
    });

  } catch (err) {
    console.log(err)
    res.status(401).json({
      status: "fail",
      error: err
    });
  }
})

app.get("/searchBooks",async (req, res) => {
  const { title } = req.query;
  const books = client.db("website1").collection("books");
  const query = { title: { $regex: '^'+title } };
  const options = {
    sort: { title: 1 }
  };

  try {
    if ((await books.countDocuments(query)) === 0) {
      throw new Error("No documents found!");
    }

    const cursor = await books.find(query, options).toArray();

    res.status(200).json({
      status: "success",
      books: cursor
    });

  } catch (err) {
    console.log(err)
    res.status(401).json({
      status: "fail",
      error: err,
      books: []
    });
  }
})

app.get('/images/:name', (req, res) => {
  const { name } = req.params;
  const imagePath = path.join(__dirname, 'uploads', name);

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error('File not found:', err);
      res.status(404).json({ error: 'Image not found' });
    }
  });
});

// app.get("*", (req, res) => {
//   res.status(404).send('Not Found');
// });


app.listen(3000, () => {
  console.log("\x1b[31m Server started on port 3000 \x1b[0m");
});
