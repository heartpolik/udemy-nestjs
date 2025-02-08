import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';

@Injectable()
class MessagesRepository {
  async findOne(id: string) {
    const contents = await readFile('./messages.json', 'utf8');
    const messages = JSON.parse(contents);

    return messages[id];
  }

  async findAll() {
    const contents = await readFile('./messages.json', 'utf8');
    const messages = JSON.parse(contents);

    return messages;
  }

  async create(content: string) {
    const contents = await readFile('./messages.json', 'utf8');
    const messages = JSON.parse(contents);

    const messageId = Math.random().toString(36).substring(2, 15);
    messages[messageId] = { id: messageId, content };

    await writeFile('./messages.json', JSON.stringify(messages, null, 2));

    return messageId;
  }
}

export default MessagesRepository;
