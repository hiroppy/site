type ContactFormEndpointEnv = {
  NEXT_PUBLIC_CONTACT_FORM_ENDPOINT?: string;
  NODE_ENV?: string;
};

const productionEndpoint = "https://coder-penguin.com/form";
const developmentEndpoint = "http://localhost:8787";

export function getContactFormEndpoint(
  env: ContactFormEndpointEnv = {
    NEXT_PUBLIC_CONTACT_FORM_ENDPOINT:
      process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT,
    NODE_ENV: process.env.NODE_ENV,
  },
) {
  const configuredEndpoint = env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT?.trim();

  if (configuredEndpoint) {
    return configuredEndpoint;
  }

  return env.NODE_ENV === "production"
    ? productionEndpoint
    : developmentEndpoint;
}
