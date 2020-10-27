import fs from 'fs';
import path from 'path';
import commands from '../../src/commands/index';

const template = fs.readFileSync(path.join(__dirname, 'cronjob-example.yaml'));

for (let index = 0; index < commands.length; index += 1) {
  const command = commands[index];

  const yaml = `${template}`
    .replace(/\$JOB_ALIAS/g, command.name)
    .replace(/\$JOB_GROUP/g, command.group)
    .replace(/\$JOB_SCHEDULE/g, command.schedule);

  fs.writeFileSync(path.join(
    __dirname,
    '..',
    'kubernetes',
    'cronjobs',
    `cronjob-${command.name}.yaml`,
  ), yaml);
}

process.exit(0);
