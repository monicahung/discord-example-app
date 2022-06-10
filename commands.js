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
    const data = await res.json();

    if (data) {
      const installedNames = data.map((c) => c['name']);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command['name'])) {
        console.log(`Installing "${command['name']}"`);
        InstallGuildCommand(appId, guildId, command);
      }  else if (command['name'] == 'stringmin') {
        console.log('Updating string');
        console.log(data)
        UpdateGuildCommand(appId, guildId, command, '981334001585225738');
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
      max_length: 3,
      min_length: 13,
    }
  ],
  type: 1,
};
