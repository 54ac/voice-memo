const express = require("express");
const helmet = require("helmet");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const app = express();
const port = process.env.PORT || 4541;
const upload = multer({
	dest: path.join(__dirname, "recordings"),
	limits: { fileSize: 2500000 },
	fileFilter: (req, file, cb) => cb(null, file.mimetype === "audio/ogg")
}).single("recording");
const adapter = new FileSync(path.join(__dirname, "voice-memo.json"));
const db = low(adapter);
db.defaults({ users: [] }).write();

const deleteTimestamp = 259200000;
const deleteInterval = 21600000;

const handleList = id => {
	const files = db
		.get("users")
		.filter({ name: id })
		.sortBy("date")
		.reverse()
		.slice(0, 5)
		.write();

	if (files) {
		return files.map(file => ({ filename: file.filename, date: file.date }));
	}
	return [];
};

const cleanup = () => {
	db.get("users")
		.filter(e => Date.now() - e.accessed > deleteTimestamp)
		.value()
		.forEach(file => {
			fs.unlink(path.join(__dirname, "recordings", file.filename), err => {
				if (err && err.code === "ENOENT") {
					db.get("users")
						.remove({ filename: file.filename })
						.write();
				} else if (err) {
					console.error(err);
				}
			});
		});

	db.get("users")
		.filter(e => Date.now() - e.accessed < deleteTimestamp)
		.write();
};

cleanup();
setInterval(cleanup, deleteInterval);

app.use(helmet());
app.use(cookieParser());

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("oh no error");
});

app.get("/api/list/:name", (req, res, next) => {
	const files = handleList(req.params.name);
	// the whole cookie thing is just rudimentary "security"
	res.cookie("auth", Buffer.from(req.ip).toString("base64"));
	res.json({ files });
});

app.post("/api/delete/:name/:filename", (req, res, next) => {
	if (req.cookies.auth === Buffer.from(req.ip).toString("base64")) {
		fs.unlink(path.join(__dirname, "recordings", req.params.filename), err => {
			if (err && !err.code === "ENOENT") next(err);
		});

		db.get("users")
			.remove({ name: req.params.name, filename: req.params.filename })
			.write();

		const files = handleList(req.params.name);
		res.status(200).send({ files });
	} else {
		res.status(403).send("absolutely not");
	}
});

app.post("/api/upload/:name", (req, res, next) => {
	upload(req, res, err => {
		if (err) next(err);
		if (req.cookies.auth === Buffer.from(req.ip).toString("base64")) {
			db.get("users")
				.push({
					name: req.params.name,
					filename: req.file.filename,
					date: Date.now(),
					accessed: Date.now()
				})
				.write();

			const files = handleList(req.params.name);
			res.status(200).send({ files });
		} else {
			res.status(403).send("absolutely not");
		}
	});
});

app.get("/api/play/:filename", (req, res, next) => {
	fs.open(path.join(__dirname, "recordings", req.params.filename), "r", err => {
		if (err && err.code === "ENOENT") {
			res.status(404).send("not found");
		} else if (err) {
			next(err);
		} else {
			db.get("users")
				.find({ filename: req.params.filename })
				.assign({ accessed: Date.now() })
				.write();
			res.sendFile(
				req.params.filename,
				{
					root: path.join(__dirname, "recordings"),
					dotfiles: "deny"
				},
				err => {
					if (err && err.code === "ENOENT") {
						res.status(404);
					} else if (err) {
						next(err);
					}
				}
			);
		}
	});
});

app.get("/*", (req, res) => {
	res.status(403).send("absolutely not");
});

app.post("/*", (req, res) => {
	res.status(403).send("absolutely not");
});

app.listen(port, "localhost", () => console.log(`listening on port ${port}`));
