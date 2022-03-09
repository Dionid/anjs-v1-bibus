export const AuthRequestTokenBodySchema = {
  title: "AuthRegisterBody Schema",
  type: "object",
  properties: {
    email: {
      type: "string",
      minLength: 1,
      description: "Email for registration",
    },
  },
  additionalProperties: false,
  required: [
    "email",
  ]
} as const;

export const AuthRequestTokenResponsesSchema = {
  "200": {
    title: "Success",
    type: "object",
    required: ["status"],
    properties: {
      status: {
        const: "success",
        type: "string",
        description: "Successful operation status",
        example: "success",
      },
    },
    additionalProperties: false,
  }
} as const;