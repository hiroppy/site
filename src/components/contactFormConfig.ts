type ContactFormEndpointEnv = {
  CONTACT_FORM_ENDPOINT?: string;
  NEXT_PUBLIC_CONTACT_FORM_ENDPOINT?: string;
  NODE_ENV?: string;
};

const productionEndpoint = "https://coder-penguin.com/form";
const developmentEndpoint = "http://localhost:8787";

export function getContactFormEndpoint(
  env: ContactFormEndpointEnv = {
    CONTACT_FORM_ENDPOINT: process.env.CONTACT_FORM_ENDPOINT,
    NEXT_PUBLIC_CONTACT_FORM_ENDPOINT:
      process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT,
    NODE_ENV: process.env.NODE_ENV,
  },
) {
  const configuredEndpoint =
    env.CONTACT_FORM_ENDPOINT?.trim() ??
    env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT?.trim();

  if (configuredEndpoint) {
    return configuredEndpoint;
  }

  return env.NODE_ENV === "production"
    ? productionEndpoint
    : developmentEndpoint;
}
