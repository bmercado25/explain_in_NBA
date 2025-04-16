const app = require('express')();
const PORT = 8080;

app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}` )
);

app.post('/tshirt', (req, res) => {
    res.status(200).send({
        shirt: 'white',
        size: 'L'
    })
});