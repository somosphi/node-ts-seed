export interface Producer {
  send(message: object): void;
}
