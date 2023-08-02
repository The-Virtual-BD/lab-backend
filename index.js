const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const multer = require("multer");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;


// hamidvirtualbd
// L7Qp4SqUZh3sZtNI


//Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Multer configuration
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads");
	},
	filename: function (req, file, cb) {
		const fileName = `${new Date().getTime()}_${file.originalname}`;
		const normalizedFileName = fileName.replace("\\", "/");
		cb(null, normalizedFileName);
	},
});

const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

//Connect DB URI
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

async function run() {
	try {
		await client.connect();
		console.log("DB Connected");

		//DB Collections
		const projectsCollection = client.db("lab-website").collection("projects");
		const newsCollection = client.db("lab-website").collection("news");
		const teamCollection = client.db("lab-website").collection("team");
		const publicationsCollection = client.db("lab-website").collection("publications");
		

		/*----------------------------
             projects Collection
        ------------------------------*/

		app.post("/projects/create", upload.single("proImg"), async (req, res) => {
			// const newCollections = req.body;

			const proName = req.body.proName;
			const proCategory = req.body.proCategory;
			const proShDesc = req.body.proShDesc;
			const proDesc = req.body.proDesc;
			const proImg = req.file.path.replace(/\\/g, "/");

			const newProject = { proName, proCategory,proShDesc, proDesc, proImg };

			const newData = await projectsCollection.insertOne(newProject);
			res.send({ Message: "Project Added Successfully", newData });
		});

		app.get("/projects/all", async (req, res) => {
			const data = await projectsCollection.find({}).toArray();
			res.send({ Message: "Success!", data: data });
		});

		app.get("/projects/:id", async (req, res) => {
			const id = req.params.id;
			// console.log(id);
			const data = await projectsCollection.findOne({
				_id: new ObjectId(id),
			});
			res.send(data);
		});

		app.delete("/projects/:id", async (req, res) => {
			const id = req.params.id;
			const deleteData = await projectsCollection.deleteOne({
				_id: new ObjectId(id),
			});
			res.send({ Message: "data Deleted", deleteData });
		});



		app.put("/projects/:id", async (req, res) => {
			const id = req.params.id;
			const product = req.body;
			const filter = { _id: new ObjectId(id) };
			const options = { upsert: true };
			const updateDoc = {
				$set: product,
			};
			const result = await projectsCollection.updateOne(
				filter,
				updateDoc,
				options
			);
			res.send({ result, product });
		});

		/*----------------------------
             News Collection
        ------------------------------*/

		app.post("/news/create",  async (req, res) => {
			const data=req.body;
			const newData = await newsCollection.insertOne(data);
			res.send({ Message: "News Added Successfully", newData });
		});

		app.get("/news/all", async (req, res) => {
			const data = await newsCollection.find({}).toArray();
			res.send({ Message: "Success!", data: data });
		});

		app.get("/news/:id", async (req, res) => {
			const id = req.params.id;
			// console.log(id);
			const data = await newsCollection.findOne({
				_id: new ObjectId(id),
			});
			res.send(data);
		});

		app.delete("/news/:id", async (req, res) => {
			const id = req.params.id;
			const deleteData = await newsCollection.deleteOne({
				_id: new ObjectId(id),
			});
			res.send({ Message: "data Deleted", deleteData });
		});

		app.put("/news/:id", async (req, res) => {
			const id = req.params.id;
			const news = req.body;
			const filter = { _id: new ObjectId(id) };
			const options = { upsert: true };
			const updateDoc = {
				$set: news,
			};
			const result = await newsCollection.updateOne(filter, updateDoc, options);
			res.send({ result, news });
		});


		
		/*----------------------------
             Team Members Collection
        ------------------------------*/

		app.post("/team/create",upload.single("memberImg"), async (req, res) => {
			const memberName = req.body.memberName;
			const memberDesi = req.body.memberDesi;
			const memberDesc = req.body.memberDesc;
			const memberImg = req.file.path.replace(/\\/g, "/");
			const createdAt=new Date();

			const newMember = { memberName, memberDesi, memberDesc, memberImg,createdAt };

			const newData = await teamCollection.insertOne(newMember);
			res.send({ Message: "New Member Added Successfully", newData });
		});

		app.get("/team/all", async (req, res) => {
			const data = await teamCollection.find({}).toArray();
			res.send({ Message: "Success!", data: data });
		});

		app.get("/team/:id", async (req, res) => {
			const id = req.params.id;
			// console.log(id);
			const data = await teamCollection.findOne({
				_id: new ObjectId(id),
			});
			res.send(data);
		});

		app.delete("/team/:id", async (req, res) => {
			const id = req.params.id;
			const deleteData = await teamCollection.deleteOne({
				_id: new ObjectId(id),
			});
			res.send({ Message: "data Deleted", deleteData });
		});

		app.put("/team/:id", async (req, res) => {
			const id = req.params.id;
			const team = req.body;
			const filter = { _id: new ObjectId(id) };
			const options = { upsert: true };
			const updateDoc = {
				$set: team,
			};
			const result = await teamCollection.updateOne(filter, updateDoc, options);
			res.send({ result, team });
		});


		/*----------------------------
            publications Collection
        ------------------------------*/

		app.post("/publications/create",upload.single("workImg"), async (req, res) => {
			const publiCategory = req.body.publiCategory;
			const publicationsLink = req.body.publicationsLink;
			const publicationsDesc = req.body.publicationsDesc;
			const createdAt=new Date();

			const newWork = { publiCategory, publicationsLink, publicationsDesc,createdAt };

			const newData = await publicationsCollection.insertOne(newWork);
			res.send({ Message: "New publications Added Successfully", newData });
		});

		app.get("/publications/all", async (req, res) => {
			const data = await publicationsCollection.find({}).toArray();
			res.send({ Message: "Success!", data: data });
		});

		app.get("/publications/:id", async (req, res) => {
			const id = req.params.id;
			// console.log(id);
			const data = await publicationsCollection.findOne({
				_id: new ObjectId(id),
			});
			res.send(data);
		});

		app.delete("/publications/:id", async (req, res) => {
			const id = req.params.id;
			const deleteData = await publicationsCollection.deleteOne({
				_id: new ObjectId(id),
			});
			res.send({ Message: "data Deleted", deleteData });
		});

		app.put("/publications/:id", async (req, res) => {
			const id = req.params.id;
			const work = req.body;
			const filter = { _id: new ObjectId(id) };
			const options = { upsert: true };
			const updateDoc = {
				$set: work,
			};
			const result = await publicationsCollection.updateOne(
				filter,
				updateDoc,
				options
			);
			res.send({ result, work });
		});


	} finally {
	}
};

run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Hello From SunRise!");
});

app.listen(port, () => {
	console.log(`SunRise app listening on port ${port}`);
});
