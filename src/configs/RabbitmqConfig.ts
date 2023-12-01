import { Connection, Channel, connect, Message } from 'amqplib';

export default class RabbitmqServer {
  private conn: Connection;
  private channel: Channel;

  constructor(private uri: string, private name: string) {}

  async start(): Promise<void> {
    this.conn = await connect(
      { protocol: 'amqp', hostname: this.uri, port: 5672, username: 'admin', password: 'admin' },
      { clientProperties: { connection_name: this.name } }
    );
    this.channel = await this.conn.createChannel();
  }

  async publishInQueue(queue: string, message: string) {
    return this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async assertQueue(queue: string) {
    return this.channel.assertQueue(queue, { durable: false });
  }

  async publishInExchange(exchange: string, routingKey: string, message: string): Promise<boolean> {
    return this.channel.publish(exchange, routingKey, Buffer.from(message));
  }

  async consume(queue: string, callback: (message: Message) => void) {
    return this.channel.consume(queue, (message) => {
      callback(message);
      this.channel.ack(message);
    });
  }
}
