import express from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import multer from 'multer';
import jwt from 'jsonwebtoken';

import users from 'app/models/users';
import Posts from 'app/models/posts';
import Comments from 'app/models/comments';
import loggedIn from 'app/middlewares/auth';

const app = express();

const {merge} = require('lodash'); 

// To store files in uploads folder and name of the file is Date+OriginalFileName
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

// To filter the types of uploading files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  }
  else {
    cb(new Error('File format not accepted, please provide jpeg or png only'), false);
  }
};

const upload = multer({storage: storage, fileFilter: fileFilter});

// To get all users from database
app.get('/', (req, res) => {
  users.find()
  .select('_id email password userImage')
  .then(doc => res.send(doc));
});


// To get a user by id with all its corresponding posts and comments
app.get('/:id/all', (req, res) => {
  users.findById(req.params.id, (err, doc) => {
    if (err) {
      console.log("Error");
      return res.send("Error");
    } else {
      Posts.find({
        userId: req.params.id
      }).then(postdocs => {
        const postIds = postdocs.map(pd => pd.id);
        Comments.find({
          "fb": {
            postId: {
              $in: postIds
            }
          }
        }, (err, comments) => {
          let response = {
            user: {
              ...doc,
              posts: postdocs.map(p => {
                return {
                  ...p,
                  comments: comments.filter(c => c.postId === p.id)
                }
              })
            }
          };
          console.log(response.user.posts);
          return res.send(response);
        });
      });
    }
  });
});

app.post('/', upload.single('userImage'), (req,res) => {

  users.find({email: req.body.email})
  .exec()
  .then(user => {
    if(user.length >= 1) {
      return res.status(409).send("User already exists");
    }
    else {
      bcrypt.hash(req.body.password, 10, function(err,hash) {
        if(err) {
          return res.status(500).send("Error");
        }
        else {
          console.log(req.file);
          const user = {
            _id: mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
            userImage: req.file.path // commented for testing purpose
          }
          const data = new users(user);
          data.save()
          .then(data => res.send(data))
          .catch((errors) => res.send(errors))
        }
      })
    }
  });
});


// app.post('/', async (req,res) => {
//   const user = {
//     _id: mongoose.Types.ObjectId(),
//     email: req.body.email,
//     password: await new Promise((resolve) => bcrypt.hash(req.body.password, 10, function(err, hash) {
//       if(err) {
//         console.log("Error");
//         return res.status(500).send("Error");
//       }
//       else {
//         resolve(hash);
//       }
//     })) 
//   };
//   const data = new users(user);
//   data.save()
//   .then(data => res.send(data))
//   .catch((errors) => {
//     res.send(errors);
//   });
// });

app.post('/login', (req,res) => {
  users.find({email: req.body.email})
    .then(user => {
      if(user.length < 1) {
        return res.status(404).send("Invalid user credentials");
      }
      else {
        bcrypt.compare(req.body.password, user[0].password, function(err, result) {
          if(result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id
              },
              'secret',
              {
                expiresIn: "1h"
              }
            );
            return res.status(200).json({
              message: "User Successfully logged in",
              token: token
            });
          }
          if(err) {
            return res.status(404).send("Invalid user credentials");
          }
          res.status(404).send("Invalid user credentials");
        })
      }
    })
    .catch((err) => res.status(500).send("Login Failed"));
});

app.get('/:id', (req,res) => {
  const id = req.params.id;
  users.findById(id, (err,doc) => {
    if(err) {
      return res.send("Error");
    }
    else {
      return res.send(doc);
    }
  });
});

app.put('/:id', (req,res) => {
  users.findById(req.params.id, (err,doc) => {
    if(err) {
      console.log("Error");
      return res.send("Error");
    }
    else {
      doc.email = req.body.email;
      doc.password = req.body.password;

      doc.save()
       .then(doc => res.send(doc));
    }
  });
});

// Initial Api written for delete request
// app.delete('/:id', (req,res) => {
//   users.findByIdAndRemove(req.params.id).exec().then(() => {
//     Posts.deleteMany({userId:req.params.id}).then(result => res.send(result));
//   });
// })


// Need to ask Mithu, because it didn't work for comments
app.delete('/:id', (req, res) => {
  users.findByIdAndRemove(req.params.id).exec().then(() => {
    // if (err) {
    //   console.log("Error");
    //   return res.send(err);
    // } else {
      Posts.find({
        userId: req.params.id
      }).then(postdocs => {
        const postIds = postdocs.map(pd => pd.id);

        Posts.deleteMany({userId:req.params.id}).then(() => {

          Comments.remove({
            "fb": {
              postId: {
                $in: postIds
              }
            }
          }).then(result => res.send(result));


          // Comments.remove({ postId: { $in: idsArray } }, function (err) {
          //   if (err) return callback("Error while deleting " + err.message);
          //   callback(null, "Some useful message here...");
          // });


          // Comments.deleteMany({
          //   "fb": {
          //     postId: {
          //       $in: postIds
          //     }
          //   }
          // }).then(result => res.send(result));


        });

        // Posts.deleteMany({userId:req.params.id}, () => {
        //   Comments.deleteMany({
        //   "fb": {
        //     postId: {
        //       $in: postIds
        //     }
        //   }
        // }).then(result => res.send(result));
        // }); 


      });
    //}
  });
});

export default app;