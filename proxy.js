const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000; // Porta para o servidor HTTP

// URLs de origem que você deseja ocultar
const sources = {
  telecine: 'http://tv.com.vc/live/valdemir@tiw/valdemir102030/454853.m3u8',
  globo: 'http://tv.com.vc/live/valdemir@tiw/valdemir102030/455318.m3u8',
  telecine_pipoca: 'https://tv.com.vc/live/valdemir@tiw/valdemir102030/454862.m3u8',
  hbo_family: 'http://tv.com.vc/live/valdemir@tiw/valdemir102030/454874.m3u8',
  sportv: 'http://tv.com.vc/live/valdemir@tiw/valdemir102030/1007829.m3u8',
  espn: 'http://tv.com.vc/live/valdemir@tiw/valdemir102030/1007816.m3u8',
};

// Função para criar middleware de proxy
const createChannelProxy = (channel) => {
  return createProxyMiddleware({
    target: sources[channel],
    changeOrigin: true,
    pathRewrite: {
      [`^/live/${channel}.m3u8`]: '',
    },
    onError: (err, req, res) => {
      console.error('Erro no proxy:', err);
      res.status(500).send('Erro ao acessar a URL de origem: ' + err.message);
    },
    onProxyRes: (proxyRes, req, res) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
  });
};

// Rotas de proxy
app.use('/live/telecine.m3u8', createChannelProxy('telecine'));
app.use('/live/globo.m3u8', createChannelProxy('globo'));
app.use('/live/telecine_pipoca.m3u8', createChannelProxy('telecine_pipoca'));
app.use('/live/hbo_family.m3u8', createChannelProxy('hbo_family'));
app.use('/live/sportv.m3u8', createChannelProxy('sportv'));
app.use('/live/espn.m3u8', createChannelProxy('espn'));

// Iniciar o servidor HTTP
app.listen(PORT, () => {
  console.log(`Proxy HTTP rodando em http://localhost:${PORT}/live/telecine.m3u8`);
  console.log(`Proxy HTTP rodando em http://localhost:${PORT}/live/globo.m3u8`);
  console.log(`Proxy HTTP rodando em http://localhost:${PORT}/live/telecine_pipoca.m3u8`);
  console.log(`Proxy HTTP rodando em http://localhost:${PORT}/live/hbo_family.m3u8`);
  console.log(`Proxy HTTP rodando em http://localhost:${PORT}/live/sportv.m3u8`);
  console.log(`Proxy HTTP rodando em http://localhost:${PORT}/live/espn.m3u8`);
});
