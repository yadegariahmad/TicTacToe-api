class RespondModel
{
  constructor(content, status, message)
  {
    this.content = content;
    this.status = status;
    this.message = message;

    this.model;
  }

  get model()
  {
    return {
      content: this.content,
      status: this.status,
      message: this.message
    };
  }
}

module.exports = RespondModel;