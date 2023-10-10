exports.handler = async event => {
  const submission = JSON.parse(event.body).payload
  console.log(submission);
}