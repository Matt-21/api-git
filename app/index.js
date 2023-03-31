const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const client_id = 'f6f7ae0bc83ecbfd1d42';
const client_secret = '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';

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => res.status(200).sendFile(path.resolve('app/index.html')))

app.get('/scripts/bootstrap.min.css', function(req, res) {
  res.sendFile(path.resolve('./node_modules/bootstrap/dist/css/bootstrap.min.css'));
})

app.get('/scripts/bootstrap.min.js', function(req, res) {
  res.sendFile(path.resolve('./node_modules/bootstrap/dist/js/bootstrap.min.js'));
});

app.get('/scripts/jquery.min.js', function(req, res) {
  res.sendFile(path.resolve('./node_modules/jquery/dist/jquery.min.js'));
});

app.get('/profile', async function(req, res) {
  const config = {
    headers:{
      'Authorization': `token ${client_secret}`
    }
  };
  await axios.get(`https://api.github.com/users/${req.query.repositorio}`, config)
  .then(async function (response) {
    return res.json({status: response.status, json: response.data});
  })
  .catch(function (error) {
    return res.json({code: error.code, status: error.response.status, msg: 'Perfil não encontrado!', error_msg: error.message});
  });

});

app.get('/repo', async function(req, res) {
  const config = {
    headers:{
      'Authorization': `token ${client_secret}`
    }
  };
  await axios.get(`https://api.github.com/users/${req.query.repositorio}/repos?per_page=${req.query.qtd}&sort=${req.query.arg}&direction=${req.query.order}`, config)
  .then(async function (response) {
    return res.json({status: response.status, json: response.data});
  })
  .catch(function (error) {
    return res.json({code: error.code, status: error.response.status, msg: 'Repositório não encontrado!', error_msg: error.message});
  });

});

app.get('/search', async function(req, res) {
  const config = {
    headers:{
      'Authorization': `token ${client_secret}`
    }
  };

  await axios.get(`https://api.github.com/search/repositories?q=${req.query.repositorio}&per_page=${req.query.qtd}&sort=${req.query.arg}&direction=${req.query.order}`, config)
  .then(async function (response) {
    return res.json(response.data);
  })
  .catch(function (error) {
    return res.json({msg: 'Repositório não encontrado! ' + error + config});
  });

});

app.get('/commits', async function(req, res) {
  const config = {
    headers:{
      'Authorization': `token ${client_secret}`
    }
  };
  var url =`https://api.github.com/repos/${req.query.login}/${req.query.repositorio}/commits?per_page=${req.query.qtd}&sort=${req.query.arg}&direction=${req.query.order}`;
  await axios.get(`https://api.github.com/repos/${req.query.login}/${req.query.repositorio}/commits?per_page=${req.query.qtd}&sort=${req.query.arg}&direction=${req.query.order}`, config)
  .then(async function (response) {
    return res.json({status: response.status, json: response.data});
  })
  .catch(function (error) {
    return res.json({code: error.code, status: error.response.status, msg: 'Commits não encontrado!', error_msg: error.message, url: url});
  });

});

app.listen(3000, 'localhost', () => console.log('Server executando na porta 3000.'));