import cluster from 'cluster';
import trabalho from './server';

const executarAdmin = () => {
  console.log('ADMIN iniciado', process.pid);
  cluster.fork();
  cluster.on('exit', (trabalho) => {
    console.log('Trabalhador morto', trabalho.process.pid);
    cluster.fork();
  });
};

const executarTrabalhadores = async () => trabalho();

cluster.isPrimary ? executarAdmin() : executarTrabalhadores();
