const monitorRoutes = require('./routes/monitor');

app.use('/monitor', monitorRoutes);

app.get('/monitor', (req, res) => {
    res.render('monitor');
}); 