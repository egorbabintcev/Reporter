export type EmailPayload = {
  email: string,
  password: string,
  recipients: Array<string>,
  subject: string,
  body: string
}

export type RawEmailPayload = {
  email: string,
  password: string,
  recipients: Array<string>,
  subject: string,
  body: string
}
