﻿import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import events from './routers/eventRouter';


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve('./././template')));
app.use('/api/v1/events', events);

app.get('/', (req, res) => {
    res.sendFile(path.resolve('./././template/index.html'));
});

export default app;
