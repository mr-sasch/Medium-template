var express = require('express');
var app     = express();
var fs      = require('fs');
// отключаем кеширования
app.disable('view cache');
// указываем какой шаблонизатор использовать
app.set('view engine', 'pug');
// расположение шаблонов ('src/templates')
app.set('views', './');
// путь до наших стилей, картинок, скриптов и т.д.
app.use('/assets', express.static('./public/assets/**/*'));
// роутинг на наши страницы
app.get('/static/*.*', function(req, res) {
  // регулярка для получения пути до шаблона
  var fileName = req.url.replace(/static\/|\..*$/g, '') || 'index';
  res.render('src/templates/' + fileName, {}); (1)
});
// редирект на главную страницу
app.get('/static', function(req, res) {
  res.redirect('/static/index.html');
});
var listener    = app.listen();
var port        = listener.address().port;
var browserSync = require('browser-sync').create();
// proxy на локальный сервер на Express
browserSync.init({
  proxy: 'http://localhost:'   + port,
  startPath: '/static/',
  notify: false,
  tunnel: false,
  host: 'localhost',
  port: port,
  logPrefix: 'Proxy to localhost:' + port,
});
// обновляем страницу, если обновились assets файлы
browserSync.watch('./public/assets/**/*').on('change', browserSync.reload);
// обновляем страницу, если был изменен исходник шаблона
browserSync.watch('./src/templates/**/*').on('change', browserSync.reload);
