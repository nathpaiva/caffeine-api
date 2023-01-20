const cluster = require('cluster');
const os = require('os');
const cpus = os.cpus();

if (cluster.isMaster) {
  console.log('Thread Master');
  cpus.forEach(() => {
    cluster.fork();
  });

  cluster.on('listening', (worker: any) => {
    console.log(`cluster ${worker.process.pid} conectado`);
  });

  cluster.on('disconnect', (worker: any) => {
    console.log(`cluster ${worker.process.pid} desconectado`);
  });

  cluster.on('exit', (worker: any) => {
    console.log(`cluster ${worker.process.pid} perdido`);
    cluster.fork();
  });
} else {
  console.log('Thread Slave');
  require('./index');
}
