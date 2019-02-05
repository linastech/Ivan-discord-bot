const uuid        = require('uuid/v1');
const i18n        = require('i18n');
const CFG         = require('config').get('app');
const Error       = require('../handlers/error');
const Helper      = require('../utils/helper');
const rndItem     = require('../utils/rndItem');

module.exports = {
  name: 'moderation',
  commands: {
    stats: {
      config: {
        cooldown: 0,
        blackListed: {},
        permissions: ['ADMINISTRATOR'],
        botPermissions: [],
        identifier: uuid(),
        guildCmdCfg: {},
      },
      aliases: [],
      exec(message, args){
        let list = '';
        message.channel.send(`**I am currently in ${message.client.guilds.size} guilds**`);

        message.client.guilds.array().forEach(element => {
          list += `>${element.name} \n`;
        });

        message.channel.send("```css\n"+list+"```");
      }
    },
    ['muted-role-add']: {
      config: {
        cooldown: 0,
        blackListed: {},
        permissions: ['ADMINISTRATOR'],
        botPermissions: ['MANAGE_ROLES'],
        identifier: uuid(),
        guildCmdCfg: {},
      },
      aliases: [],
      async exec(message, args){
        if(args.length == 0){
          Helper.responseError(i18n.__("moderation.input_role"), message.channel);
          return;
        }

        let role = message.mentions.roles.first();

        //no role was mentioned
        if(typeof role == 'undefined'){
          role = args[0].replace("@", "");

          //try to find it by name
          matched = message.guild.roles.find(item => item.name == role)
          
          //nothing found, proceed to create a new role
          if(matched == null){
            role = await new Promise((resolve, reject) => {
              message.guild.createRole({
                name: role
              })
              .then(response => {
                role = response;

                message.channel.send(`No role was found in the guild! Created a new role @${response.name}, please update channel settings!`);
                resolve(response);
              })
              .catch(error => {
                reject(error);
                Error.logError(error);
              });
            });
          }else{
            role = matched;
          }
        }

        const configObj = {roleId: role.id};

        message.client.DB['guild-cmd-cfg']
          .setConfig(message.guild.id, 'mute', configObj)
          .then(response => {
            message.channel.send(i18n.__("moderation.role_created"));
          })
          .catch(error => Error.logError(error));
      }
    },
    mute: {
      config: {
        cooldown: 0,
        blackListed: {},
        permissions: ['MUTE_MEMBERS'],
        botPermissions: ['MANAGE_ROLES'],
        identifier: uuid(),
        guildCmdCfg: {},
      },
      aliases: [],
      exec(message, args){
        const user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        
        if(user == null){
          Helper.responseError(i18n.__("moderation.user_not_found"), message.channel);
          return false;
        }
        
        if(typeof args[1] == 'undefined'){
          Helper.responseError(i18n.__("moderation.mute_duration"), message.channel);
          return false;
        }
        
        //check if guild has muted role set
        if(this.config.guildCmdCfg[message.guild.id] == null){
          Helper.responseError(`Please assign muted role with \`${CFG.prefix}muted-role-add\``, message.channel);
          return false;
        }

        const mutedRole = message.guild.roles.get(this.config.guildCmdCfg[message.guild.id].roleId);
          
        if(user.roles.find(role => role.id == mutedRole.id) != null){
          Helper.responseError(i18n.__("moderation.user_already_muted"), message.channel);
          return false;
        }

        //give muted role perm
        user
          .addRole(mutedRole.id)
          .then( message.channel.send(`<@${user.id}> has been muted!`))
          .catch(error => Error.logError(error));

        //unmute after specified duration has expired
        setTimeout(() => {
          user.removeRole(mutedRole.id)
            .then( message.channel.send(`<@${user.id}> has been unmuted!`))
            .catch(error => Error.logError(error));
        }, args[1] * 60000);
      }
    },
    kick: {
      config: {
        cooldown: 0,
        blackListed: {},
        permissions: ['KICK_MEMBERS'],
        botPermissions: ['KICK_MEMBERS'],
        identifier: uuid(),
        guildCmdCfg: {},
      },
      aliases: [],
      exec(message, args){
        const user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        
        if(user == null){
          Helper.responseError(i18n.__("moderation.user_not_found"), message.channel);
          return false;
        }

        if(typeof args[1] == 'undefined'){
          Helper.responseError(i18n.__("moderation.no_reason_given"), message.channel);
          return false;
        }

        user.kick(args[1])
          .then(message.channel.send(`<@${user.id}> has been kicked!`))
          .catch(error => Error.logError(error));
      }
    },
    ban: {
      config: {
        cooldown: 0,
        blackListed: {},
        permissions: ['BAN_MEMBERS'],
        botPermissions: ['BAN_MEMBERS'],
        identifier: uuid(),
        guildCmdCfg: {},
      },
      aliases: [],
      exec(message, args){
        const user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        
        if(user.bannable == false){
          Helper.responseError(`I can't ban ${user.displayName}!`, message.channel);
          return false;          
        }

        if(user == null){
          Helper.responseError(i18n.__("moderation.user_not_found"), message.channel);
          return false;
        }

        if(typeof args[1] == 'undefined'){
          Helper.responseError(i18n.__("moderation.no_reason_given"), message.channel);
          return false;
        }

        user.ban(args[1])
          .then(message.channel.send(`<@${user.id}> has been banned!`))
          .catch(error => Error.logError(error));
      }
    },
    clear: {
      config: {
        cooldown: 0,
        blackListed: {},
        permissions: ['MANAGE_MESSAGES'],
        botPermissions: [],
        identifier: uuid(),
        guildCmdCfg: {},
      },
      aliases: [],
      exec(message, args){
        //check if number of messages is a number
        if(args.length == 0 || Number.isInteger(parseInt(args[0])) == false || parseInt(args[0]) > 100 || parseInt(args[0]) < 1){
          Helper.responseError(i18n.__("moderation.message_requirements"), message.channel);
          return false;
        }

        //fetch messages to be deleted
        message.channel.fetchMessages({limit: parseInt(args[0]) + 1})
          .then(messages => {
            //bulk delete fetched messages
            message.channel
              .bulkDelete(messages)
              //post response to the user
              .then(() => {
                message.channel
                  .send(`Deleted ${args[0]} messages!`)
                    //delete response after couple sec delay
                    .then(response => setTimeout( () => response.delete(), 3500));
              })
              .catch(error => Error.logError(error));
          })
          .catch(error => Error.logError(error));
      }
    },
    backup: {
      config: {
        cooldown: 0,
        blackListed: {},
        permissions: ['ADMINISTRATOR'],
        botPermissions: ['ADMINISTRATOR'],
        identifier: uuid(),
        guildCmdCfg: {},
      },
      aliases: [],
      exec(message, args){
        // message.client.DB.messages.saveGuild(message);
        message.client.DB.messages.insertMessage(message);
        // message.client.DB.messages.test(message);
      }
    },
  }
}