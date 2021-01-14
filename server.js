const app = require('./app');
const port = process.env.PORT || 3001;

const dbConnection = require('./config/dbConnection')
dbConnection.connectToDbServer()

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})