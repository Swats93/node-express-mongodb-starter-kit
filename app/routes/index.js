import express from 'express';

import users from 'app/routes/users';
import comments from 'app/routes/comments';
import posts from 'app/routes/posts';


const app = express();

app.get('/', function(req, res) {
  res.send('Hello World!!');
});

app.use('/users', users);
app.use('/comments', comments);
app.use('/posts', posts);

export default app;