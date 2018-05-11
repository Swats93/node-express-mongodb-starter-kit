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
  .then(data => res.send(data))
  .catch((errors) => {
    res.send(errors);
  });
});

app.get('/:id/all', (req,res) => {
	Posts.findById(req.params.id, (err,doc) => {
		if(err) {
			console.log("Error");
			return res.send("Error");
		}
		else {
			Comments.find({postId: req.params.id}).then(commentDoc => {
				let response = {
					posts: {
						...doc,
						comments: commentDoc
					}
				}
				return res.send(response);
			});
		}
	});
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


app.put('/:id', (req,res) => {
  Posts.findById(req.params.id, (err,doc) => {
    if(err) {
      console.log("Error");
      return res.send("Error");
    }
    else {
      doc.title = req.body.title;
      doc.content = req.body.content;
      doc.userId = req.body.userId;
      doc.save()
       .then(doc => res.send(doc));
    }
  });
});

app.delete('/:id', (req,res) => {
  Posts.findByIdAndRemove(req.params.id).exec().then(() => {
  	Comments.deleteMany({postId: req.params.id}).then(result => res.send(result));
  });
});

export default app;