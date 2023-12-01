import 'dotenv/config';
import express, { Request, Response } from 'express';
import RabbitmqServer from './configs/RabbitmqConfig';
import bodyParser from 'body-parser';

const trabalho = () => {
  const app = express();
  app.set('trust proxy', true);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Headers', '*');
    next();
  });
  const serverRabbit = new RabbitmqServer('localhost', 'DBU TECH - PRODUTOR');
  serverRabbit.start();

  app.post('/queue', async (req: Request, res: Response) => {
    try {
      await serverRabbit.assertQueue('dbu');
      const result = await serverRabbit.publishInQueue('dbu', JSON.stringify(req.body));
      if (!result) throw new Error('Erro ao enviar para a fila');
      return res.status(200).send(req.body);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  const server = app.listen(process.env.PORT_SERVER, () => console.log(`servidor rodado na porta ${process.env.PORT_SERVER}`));

  process.on('SIGTERM', () =>
    server.close(() => {
      console.error('Trabalhador morto', process.pid);
      process.exit();
    })
  );
};

export default trabalho;
