const express = require('express');
const multer = require('multer');
const path = require('path');
let temp
(async () => {
    temp = await import('./temp.mjs');
})();

const app = express();
const port = 3939;

const cors = require("cors");
app.use(
    cors({
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        optionsSuccessStatus: 200,
    })
);

const jwt = require("jsonwebtoken");
const secretKey = "theSecretKey";

app.use(express.json());
const db = require("./db");

app.get("/", (req, res) => {
    res.send("Good")
})

app.post("/token", async (req, res) => {
    const id = await db.auth(req.body.username, req.body.password);
    if (id) {
        // 生成并发送token
        const token = jwt.sign(req.body, secretKey, { expiresIn: "3d" });
        res.status(201).json({ token: token, id: id });
    } else {
        res.sendStatus(401);
    }
})

app.post("/users", async (req, res) => {
    if (await db.isUserExists(req.body.username)) res.sendStatus(400);
    else {
        if (
            await db.addUser(
                req.body.username, req.body.password
            )
        ) {
            res.sendStatus(201);
        } else {
            res.sendStatus(500);
        }
    }
});

app.put("/users/:id/password", async (req, res) => {
    jwt.verify(
        req.header("Authorization").split(" ")[1],
        secretKey,
        async (error, user) => {
            if (!user) {
                console.log("user authentication failed");
                res.sendStatus(401);
                return;
            }

            // 验证用户信息
            const id = await db.auth(user.username, user.password);
            if (String(id) !== req.params.id) {
                res.sendStatus(401);
                return;
            }
            if (await db.changePassword(user.username, req.body.newpassword)) {
                res.sendStatus(204);
            } else {
                res.sendStatus(500);
            }
        }
    );
})

app.get("/info/:id", async (req, res) => {
    jwt.verify(
        req.header("Authorization").split(" ")[1],
        secretKey,
        async (error, user) => {
            if (!user) {
                console.log("user authentication failed");
                res.sendStatus(401);
                return;
            }
            // 验证用户信息
            const id = await db.auth(user.username, user.password);
            if (String(id) !== req.params.id && !user.username.includes('doc_')) {
                res.sendStatus(401);
                return;
            }
            const info = await db.getInfo(req.params.id)
            if (info) {
                res.send(info);
            } else {
                res.sendStatus(404);
            }
        }
    );
})

app.post("/info/:id", async (req, res) => {
    jwt.verify(
        req.header("Authorization").split(" ")[1],
        secretKey,
        async (error, user) => {
            if (!user) {
                console.log("user authentication failed");
                res.sendStatus(401);
                return;
            }
            // 验证用户信息
            const id = await db.auth(user.username, user.password);
            if (String(id) !== req.params.id) {
                res.sendStatus(401);
                return;
            }
            if (await db.addInfo(id, req.body)) {
                res.sendStatus(201);
            } else {
                res.sendStatus(500);
            }
        }
    );
})

app.put("/info/:id", async (req, res) => {
    jwt.verify(
        req.header("Authorization").split(" ")[1],
        secretKey,
        async (error, user) => {
            if (!user) {
                console.log("user authentication failed");
                res.sendStatus(401);
                return;
            }
            // 验证用户信息
            const id = await db.auth(user.username, user.password);
            if (String(id) !== req.params.id) {
                res.sendStatus(401);
                return;
            }
            if (await db.changeInfo(id, req.body)) {
                res.sendStatus(204);
            } else {
                res.sendStatus(500);
            }
        }
    );
})

app.use('/static', express.static(path.join(__dirname, 'public')));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/uploads')); // destination directory
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // file name
    }
});
const upload = multer({ storage: storage });

app.post("/info/:id/picture", upload.single('picture'), async (req, res) => {
    try {
        const filePath = `http://192.227.138.209:3939/static/uploads/${req.file.filename}`;
        console.log("File uploaded: " + req.file.filename);
        res.status(201).json({ picture_url: filePath });
    } catch (err) {
        res.sendStatus(400);
    }
})

app.get("/archives/:id", async (req, res) => {
    jwt.verify(
        req.header("Authorization").split(" ")[1],
        secretKey,
        async (error, user) => {
            if (!user) {
                console.log("user authentication failed");
                res.sendStatus(401);
                return;
            }
            // 验证用户信息
            const id = await db.auth(user.username, user.password);
            if (String(id) !== req.params.id  && !user.username.includes('doc_')) {
                res.sendStatus(401);
                return;
            }
            const data = await db.getArchive(req.params.id)
            if (data) {
                if (data instanceof Array) {
                    res.send(data);
                }
                else { res.send([data]); }
            } else {
                res.sendStatus(404);
            }
        }
    );
})

app.post("/archives/:id", async (req, res) => {
    jwt.verify(
        req.header("Authorization").split(" ")[1],
        secretKey,
        async (error, user) => {
            if (!user) {
                console.log("user authentication failed");
                res.sendStatus(401);
                return;
            }
            // 验证用户信息
            const id = await db.auth(user.username, user.password);
            if (String(id) !== req.params.id) {
                res.sendStatus(401);
                return;
            }
            if (await db.addArchive(id, req.body)) {
                res.sendStatus(201);
            } else {
                res.sendStatus(500);
            }
        }
    );
})

app.put("/archives/:id", async (req, res) => {
    jwt.verify(
        req.header("Authorization").split(" ")[1],
        secretKey,
        async (error, user) => {
            if (!user) {
                console.log("user authentication failed");
                res.sendStatus(401);
                return;
            }
            // 验证用户信息
            const id = await db.auth(user.username, user.password);
            if (!id) {
                // if (String(id) !== req.params.id) {
                res.sendStatus(401);
                return;
            }
            // if (await db.changeArchive(id, req.body)) {
            if (await db.changeArchive(req.params.id, req.body)) {
                res.sendStatus(204);
            } else {
                res.sendStatus(500);
            }
        }
    );
})

app.post("/predict", async (req, res) => {
    jwt.verify(
        req.header("Authorization").split(" ")[1],
        secretKey,
        async (error, user) => {
            if (!user) {
                console.log("user authentication failed");
                res.sendStatus(401);
                return;
            }
            const id = await db.auth(user.username, user.password);
            if (!id) {
                res.sendStatus(401);
                return;
            }
            const result = await temp.predict(req.body);
            if (result) {
                console.log("predict successed: " + result.label);
                if (parseInt(result.label.split(" ")[1]) >= 2) {
                    db.saveAbnormal(id, req.body.signal, result.url, result.label);
                }
                res.send(result);
            } else {
                console.log("predict failed");
                res.sendStatus(500);
            }
        });
})

app.get("/abnormal_signals", async (req, res) => {
  const result = await db.getAbnormal();
  if (result) {
    res.send(result);
  }else{
    console.log("failed to get abnormal_signals");
    res.sendStatus(404);
  }
});

app.get("/abnormal_signals/no_comment", async (req, res) => {
    const result = await db.getAbnormalNoComment();
    if (result) {
      res.send(result);
    }else{
      console.log("failed to get no_comment");
      res.sendStatus(404);
    }
  });

app.get("/abnormal_signals/:id", async (req, res) => {
    const result = await db.getUserAbnormal(req.params.id);
    if (result) {
      res.send(result);
    }else{
      console.log("failed to get abnormal_signals of user:"+req.params.id);
      res.sendStatus(404);
    }
  });

app.put("/abnormal_signals/:abnormal_id/comments", async (req, res) =>{
    if (await db.commentAbnormal(req.params.abnormal_id, req.body.comment)) {
        res.sendStatus(204);
    } else {
        console.log("failed to comment"+req.params.abnormal_id);
        res.sendStatus(500);
    }
})



app.listen(port)