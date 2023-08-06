const express = require('express')
const PORT = process.env.PORT || 8000
const pool = require('./db')
const cors = require('cors')


app = express()
app.use(cors())

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





app.listen(PORT, () => {
  console.log(`Express app is listening on PORT ${PORT}`)

})