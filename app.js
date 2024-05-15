const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');  // Importar CORS

const app = express();
const port = 3000;

app.use(cors());  // Habilitar CORS para todas las rutas
app.use(express.json());

// Endpoint para buscar palabras en los archivos JSON
app.get('/search', (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    const dataDir = path.join(__dirname, 'data');
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));

    let results = [];

    files.forEach(file => {
        const filePath = path.join(dataDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        Object.keys(content).forEach(key => {
            if (typeof content[key] === 'string' && content[key].includes(query)) {
                results.push({ file, key, value: content[key] });
            }
        });
    });

    res.json(results);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
