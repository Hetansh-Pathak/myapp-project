const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint — used by Docker HEALTHCHECK, and by the
// GitHub Actions deploy script before it switches Nginx traffic over.
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/', (req, res) => {
  res.send(`
    <h1>Hello from CI/CD - deployed automatically!</h1>
    <p>Running in a Docker container on: ${new Date().toISOString()}</p>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
