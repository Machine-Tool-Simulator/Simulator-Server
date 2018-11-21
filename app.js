import express from 'express';
import config from './config/config';
import setup from './config/setup';

const app = express();
setup(app, config);

module.exports = app;
