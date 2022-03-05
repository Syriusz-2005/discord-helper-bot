


export class Command {
  constructor({
    usage,
    description,
    requiredChannelId
  }) {
    this.usage = usage;
    this.description = description;
    this.requiredChannelId = requiredChannelId;
  }
}