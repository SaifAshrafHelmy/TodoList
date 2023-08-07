const express = require('express')
const PORT = process.env.PORT || 8000
const pool = require('./db')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')




const saltRounds = 10;


app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Success Home")
})

/* Get all todos */
app.get("/todos/:userEmail", async (req, res) => {
  const { userEmail } = req.params;
  console.log(`got a REQUEST on -- /todos -- with email ${userEmail}`)


  try {
    todos = await pool.query('SELECT * FROM todos WHERE user_email = $1;', [userEmail])

    res.json(todos.rows)

  } catch (error) {
    console.error(error)
    // res.send(error)

  }
})


/* Create a new todo */
app.post('/todos', async (req,res)=>{
  try {
    console.log(req.body)
    const {user_email, title, progress, date} = req.body;
    console.log({user_email, title, progress, date})

    const newTodo = await pool.query(
      "INSERT INTO todos(user_email, title, progress,date) VALUES($1, $2, $3, $4);",
    [ user_email, title, progress, date])
    res.json(newTodo)
    
  } catch (error) {
    console.error(error)
    
  }
})

/* Edit a todo */
app.patch('/todos/:id', async (req,res)=>{
  try {
    console.log(req.body)
    const {id} = req.params;
    const {user_email, title, progress, date} = req.body;
    console.log({id, user_email, title, progress, date})

    const newTodo = await pool.query(
      "UPDATE todos SET title = $1, progress = $2, date = $3 WHERE todos.id = $4 AND user_email = $5;",
    [ title, progress, date, id, user_email,])
    res.json(newTodo)
    
  } catch (error) {
    console.error(error)
    
  }
})



/* Delete a todo */
app.delete('/todos/:id', async (req,res)=>{
  try {
    const {id} = req.params;

    const deletedTodo = await pool.query(
      "DELETE from todos WHERE todos.id = $1 ",
    [id])
    res.json(deletedTodo)
    
  } catch (error) {
    console.error(error)
    
  }
})



/* Sign Up */
app.post('/signup', async(req,res)=>{
  const {email, password} = req.body;
  const hashedPassword = bcrypt.hashSync(password, saltRounds)  

  try {

    const newUser = await pool.query("INSERT INTO users(email, hashed_password) VALUES($1, $2);", [email, hashedPassword])
    const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})
    res.json({email, token})
  } catch (error) {
    res.json({detail: error.detail})
  }

})


/* Login */
app.post('/login', async(req,res)=>{
  const {email, password} = req.body;
  console.log(password)
  const ans = await pool.query("SELECT hashed_password FROM users WHERE email = $1;", [email])
  const existing_hashed_password = ans.rows[0].hashed_password
  console.log(existing_hashed_password)

  try {
    const isRightPassword = bcrypt.compareSync(password, existing_hashed_password)
    console.log(isRightPassword);
  } catch (error) {
    console.error(error)
  }
})



app.listen(PORT, () => {
  console.log(`Express app is listening on PORT ${PORT}`)

})