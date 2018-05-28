import express from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import users from 'app/models/users';
import Posts from 'app/models/posts';
import Comments from 'app/models/comments';

const app = express();

const {merge} = require('lodash'); 

app.get('/', (req, res) => {
  users.find()
  .select('_id email password')
  .then(doc => res.send(doc));
});

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


// Initial Api for post request
// app.post('/', (req,res) => {
//   const user = {
//     email: req.body.email,
//     password: req.body.password
//   };
//   const data = new users(user);
//   data.save()
//   .then(data => res.send(data))
//   .catch((errors) => {
//     res.send(errors);
//   });
// });

app.post('/', (req,res) => {

  bcrypt.hash(req.body.password, 10, function(err,hash) {
    if(err) {
      console.log("Error");
      return res.status(500).send("Error");
    }
    else {
      const user = {
        _id: mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash
      }
      const data = new users(user);
      data.save()
      .then(data => res.send(data))
      .catch((errors) => res.send(errors))
    }
  })
  // Error: await is a reserved keyword, need to ask Mithu
  // const user = {
  //   email: req.body.email,
  //   password: await new Promise((resolve) => bcrypt.hash(req.body.password, 10, function(err, hash) {
  //     if(err) {
  //       console.log("Error");
  //       return res.status(500).send("Error");
  //     }
  //     else {
  //       resolve(hash);
  //     }
  //   })) 
  // };
  // const data = new users(user);
  // data.save()
  // .then(data => res.send(data))
  // .catch((errors) => {
  //   res.send(errors);
  // });
});

app.get('/:id', (req,res) => {
  const id = req.params.id;
  users.findById(id, (err,doc) => {
    if(err) {
      console.log("Error");
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