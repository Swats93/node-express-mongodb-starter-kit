import express from 'express';

import Comments from 'app/models/comments';

const app = express();

app.get('/', (req, res) => {
  Comments.find().then(doc => res.send(doc));
});

app.post('/', (req,res) => {
  const post = {
  	postId: req.body.postId,
    content: req.body.content
  };
  const data = new Comments(post);
  data.save()
  .then(data => res.send(data));
});


app.get('/:id', (req,res) => {
  const id = req.params.id;
  Comments.findById(id, (err,doc) => {
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
  Comments.findById(id, (err,doc) => {
    if(err) {
      console.log("Error");
      return res.send("Error");
    }
    else {
      doc.content = req.body.content;

      doc.save()
       .then(doc => res.send(doc));
    }
  });
});

app.post('/delete', (req,res) => {
  const id = req.body.id;
  Comments.findByIdAndRemove(id).exec().then(result => res.send(result));
})

export default app;