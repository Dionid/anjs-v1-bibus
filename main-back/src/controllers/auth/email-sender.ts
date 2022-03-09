export type EmailSender = {
  sendEmail: (message: string, email: string) => Promise<void>
}
export const emailSender = {
  sendEmail: async (message: string, email: string): Promise<void> => {
    console.log("SEND_EMAIL", message, email)
  }
}
