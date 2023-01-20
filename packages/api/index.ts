import app from './config/express'
import db from './models/db'

db.connection()

const port = process.env.PORT || 3000; // used to create, sign, and verify tokens

app().listen(port, () => {
  console.log('====================================');
  console.log('Magic happens at http://localhost:' + port);
  console.log('====================================');
});
