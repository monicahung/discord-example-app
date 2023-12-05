import { getRPSChoices } from './game.js';
import { capitalize, DiscordRequest } from './utils.js';

export async function HasGuildCommands(appId, guildId, commands) {
  if (guildId === '' || appId === '') return;

  commands.forEach((c) => HasGuildCommand(appId, guildId, c));
}

// Checks for a command
async function HasGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

  try {
    const res = await DiscordRequest(endpoint, { method: 'GET' });
    const text = await res.text()
     console.log({'~~ status':res.status, res: text, })
    const data = JSON.parse(text);
    //console.log({'~~ data':data})

    if (data) {
      const installedNames = data.map((c) => c['name']);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command['name'])) {
        console.log(`Installing "${command['name']}"`);
        InstallGuildCommand(appId, guildId, command);
      }  else if (command['name'] == 'max-attachments') {
        console.log('Updating string');
        console.log(data)
        //UpdateGuildCommand(appId, guildId, command, '1141584896788004864');
      } else {
        console.log(`"${command['name']}" command already installed`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Installs a command
export async function InstallGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  // install command
  try {
    await DiscordRequest(endpoint, { method: 'POST', body: command });
  } catch (err) {
    console.error(err);
  }
}

export async function UpdateGuildCommand(appId, guildId, command, command_id) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands/${command_id}`;
  // install command
  try {
    await DiscordRequest(endpoint, { method: 'PATCH', body: command });
  } catch (err) {
    console.error(err);
  }
}

export async function HasGlobalCommands(appId, commands) {
  if (appId === '') return;

  commands.forEach((c) => HasGlobalCommand(appId, c));
}

// Checks for a command
async function HasGlobalCommand(appId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/commands`;

  try {
    const res = await DiscordRequest(endpoint, { method: 'GET' });
    const text = await res.text()
    //console.log({'~~ status':res.status, res: text, })
    const data = JSON.parse(text);
    //console.log({'~~ data':data})

    if (data) {
      const installedNames = data.map((c) => c['name']);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command['name'])) {
        console.log(`Installing global "${command['name']}"`);
        InstallGlobalCommand(appId, command);
      }  else if (command['name'] == 'max-attachments') {
        console.log('Updating global string');
        console.log(data)
        //UpdateGlobalCommand(appId, command, '1141584896788004864');
      } else {
        console.log(`"${command['name']}" command already globally installed`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Installs a command
export async function InstallGlobalCommand(appId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/commands`;
  // install command
  try {
    await DiscordRequest(endpoint, { method: 'POST', body: command });
  } catch (err) {
    console.error(err);
  }
}

export async function UpdateGlobalCommand(appId, command, command_id) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/commands/${command_id}`;
  // install command
  try {
    await DiscordRequest(endpoint, { method: 'PATCH', body: command });
  } catch (err) {
    console.error(err);
  }
}

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
export const TEST_COMMAND = {
  name: 'test',
  description: 'Basic guild command',
  type: 1,
};

// Command containing options
export const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
};

export const VALUE_COMMAND = {
  name: 'value',
  description: 'write a value',
  options:
  [
    {
      type: 4,
      name: 'value',
      description: 'your value',
      required: true,
      min_value: 5,
      max_value: 20,
    }
  ],
  type: 1,
};

export const STRING_COMMAND = {
  name: 'string2',
  description: 'write a string',
  options:
  [
    {
      type: 3,
      name: 'value',
      description: 'your value',
      required: true,
      min_length: 2,
      max_length: 10,
    }
  ],
  type: 1,
};


export const STRING_MIN_COMMAND = {
  name: 'stringmin',
  description: 'write a string',
  options:
  [
    {
      type: 3,
      name: 'value',
      description: 'your value',
      required: true,
      min_length: 3,
    }
  ],
  type: 1,
};

export const STRING_MAX_COMMAND = {
  name: 'stringmax',
  description: 'write a string',
  options:
  [
    {
      type: 3,
      name: 'value',
      description: 'your value',
      required: true,
      max_length: 10,
    }
  ],
  type: 1,
};

export const STRING_BAD_COMMAND = {
  name: 'stringbad',
  description: 'write a string',
  options:
  [
    {
      type: 3,
      name: 'value',
      description: 'your value',
      required: true,
    }
  ],
  type: 1,
};

export const ATTACHMENT_COMMAND = {
  name: 'attachments',
  description: 'attach multiple files',
  options: [
    {
      type: 11,
      name: 'file1',
      description: 'Provide a file',
      required: true,
    },
    {
      type: 3,
      name: 'string-required',
      description: 'A required string arg',
      required: true,
    },
    {
      type: 11,
      name: 'file2',
      description: 'Provide another file',
      required: false,
    },
    {
      type: 11,
      name: 'file3',
      description: 'Provide another file (optionally)',
      required: false,
    },
    {
      type: 3,
      name: 'string-optional',
      description: 'An optional string arg',
      required: false,
    },
  ],
};

export const MAX_ATTACHMENT_COMMAND = {
  name: 'max-attachments',
  description: 'attach multiple files',
  options: [
    {
      type: 11,
      name: 'file1',
      description: 'Provide a file',
      required: true,
    },
    {
      type: 11,
      name: 'file2',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file3',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file4',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file5',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file6',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file7',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file8',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file9',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file10',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file11',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file12',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file13',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file14',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file15',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file16',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file17',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file18',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file19',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file20',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file21',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file22',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file23',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file24',
      description: 'Provide another file',
      required: true,
    },
    {
      type: 11,
      name: 'file25',
      description: 'Provide another file',
      required: true,
    },
  ],
};
