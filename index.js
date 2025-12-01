const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'CalculadoraMat',
  password: 'postgres',
  port: 5432,
});

// -------------------- LOGIN --------------------
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email=$1 AND senha=$2',
      [email, senha]
    );
    if (result.rows.length > 0) {
      res.json({ success: true, usuario: result.rows[0] });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

// -------------------- PERGUNTAS --------------------
app.get('/api/perguntas', async (req, res) => {
  const nivel = parseInt(req.query.nivel);
  try {
    const result = await pool.query(
      'SELECT * FROM perguntas_trl WHERE nivel=$1 ORDER BY id_pergunta',
      [nivel]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar perguntas');
  }
});

app.post('/api/perguntas', async (req, res) => {
  const { nivel, texto } = req.body;
  try {
    await pool.query(
      'INSERT INTO perguntas_trl (nivel, texto_pergunta) VALUES ($1, $2)',
      [nivel, texto]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar pergunta');
  }
});

// -------------------- AVALIACOES --------------------
app.post('/api/avaliacoes', async (req, res) => {
  const { id_usuario, nivel, respostas } = req.body;
  try {
    // Inserir avaliação
    const result = await pool.query(
      'INSERT INTO avaliacoes (id_usuario, nivel) VALUES ($1, $2) RETURNING id_avaliacao',
      [id_usuario, nivel]
    );
    const id_avaliacao = result.rows[0].id_avaliacao;

    // Inserir respostas
    for (const r of respostas) {
      await pool.query(
        'INSERT INTO respostas_trl (id_avaliacao, id_pergunta, resposta) VALUES ($1, $2, $3)',
        [id_avaliacao, r.id_pergunta, r.resposta]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar avaliação');
  }
});

// -------------------- RELATORIO --------------------
app.get('/api/relatorio', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_avaliacao, id_usuario FROM avaliacoes');
    const relatorio = [];

    for (const row of result.rows) {
      const respostas = await pool.query(
        'SELECT resposta FROM respostas_trl WHERE id_avaliacao=$1',
        [row.id_avaliacao]
      );
      const total = respostas.rows.length;
      const acertos = respostas.rows.filter(r => [7,8,9,10].includes(r.resposta)).length;
      const percentual = total === 0 ? 0 : (acertos / total) * 100;
      relatorio.push({ id_usuario: row.id_usuario, percentual });
    }

    res.json(relatorio);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao gerar relatório');
  }
});

// -------------------- START SERVER --------------------
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
