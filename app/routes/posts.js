import express from 'express';

import Posts from 'app/models/posts';
import Comments from 'app/models/comments';

const app = express();

app.get('/', (req, res) => {
  Posts.find().then(doc => res.send(doc));
});

app.post('/', (req,res) => {
  const post = {
  	userId: req.body.userId,
    title: req.body.title,
    content: req.body.content
  };
  const data = new Posts(post);
  data.save()
  .then(data => res.send(data));
});


app.get('/:id', (req,res) => {
  const id = req.params.id;
  Posts.findById(id, (err,doc) => {
    if(err) {
      console.log("Error");
      return res.send("Error");
    }
    else {
      return res.send(doc);
    }
  });
});


app.post('/update', (req,res) => {
  const id = req.body.id;
  Posts.findById(id, (err,doc) => {
    if(err) {
      console.log("Error");
      return res.send("Error");
    }
    else {
      doc.title = req.body.title;
      doc.content = req.body.content;

      doc.save()
       .then(doc => res.send(doc));
    }
  });
});

app.post('/delete', (req,res) => {
  const id = req.body.id;
  Comments.deleteMany({postId:id}).then(result => res.send(result));
  Posts.findByIdAndRemove(id).exec().then(result => res.send(result));

  // Posts.findByIdAndRemove(id, (err,doc) => {
  // 	if(err) {
  // 		return res.send("Error in Delete api");
  // 	}
  // 	else {
  // 		Comments.deleteMany({postId: id}, (err,doc) => {
  // 			if(err) {
  // 				return res.send("Error in Comments Delete api");
  // 			}
  // 			else {
  // 				res.send("Comments also deleted successfully");
  // 			}
  // 		})
  // 	}
  // }).exec().then(result => res.send(result));
})

export default app;