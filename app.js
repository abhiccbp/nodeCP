const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const databasePath = path.join(__dirname, 'moviesData.db')
const app = express()
app.use(express.json())

let database = null

const indbsrvr = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () =>
      console.log('Server Running at http://localhost:3000/'),
    )
  } catch (error) {
    console.log(`DB Error:${error.message}`)
    process.exit(1)
  }
}
indbsrvr()

app.get('/movies/', async (request, response) => {
  const query = `select * from movie`
  const film = await database.all(query)
  response.send(film)
})

app.get('/movies/:movieId', async (request, response) => {
  const {movieId} = request.params
  const getquery = `select * from movie
  where movie_id=${movieId}`
  const film = await database.get(getquery)
  response.send(film)
})
module.exports = app

app.get('/directors/', async (request, response) => {
  const dirQuery = `
  select * from director
  `
  const film = await database.all(dirQuery)
  response.send(film)
})

app.post('/movies/', async (request, response) => {
  const {directorId, movieName, leadActor} = request.body
  const postQuery = `Insert into movie(director_id,movie_name,lead_actor)
  values
  (${directorId},"${movieName}","${leadActor}");`
  const film = await database.run(postQuery)
  response.send('Movie Successfully Added')
})

app.delete('/movies/:movieId', async (request, response) => {
  const {movieId} = request.params
  const delQuery = `Delete from movie
  where movie_id=${movieId};`
  await database.run(delQuery)
  response.send('Movie Removed')
})

app.put('/movies/:movieId', async (request, response) => {
  const {movieId} = request.params
  const updateDetails = request.body
  const {directorId, movieName, leadActor} = updateDetails
  const updateQuery = `UPDATE movie
  SET
  
  director_id='${directorId}',
  movie_name='${movieName}',
  lead_actor='${leadActor}'
  WHERE 
  movie_id=${movieId};
  `
  await database.run(updateQuery)
  response.send('Movie Details Updated')
})
