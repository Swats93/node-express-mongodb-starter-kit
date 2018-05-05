import express from 'express';

import users from 'app/models/users';

const app = express();

app.get('/', (req, res) => {
  users.find().then(doc => res.send(doc));
});

app.post('/', (req,res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };
  const data = new users(user);
  data.save()
  .then(data => res.send(data));
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


app.post('/update', (req,res) => {
  const id = req.body.id;
  users.findById(id, (err,doc) => {
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

app.post('/delete', (req,res) => {
  const id = req.body.id;
  users.findByIdAndRemove(id).exec().then(result => res.send(result));
})

export default app;