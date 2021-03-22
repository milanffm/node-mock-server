import { scenariosForEndpoint } from "./mock-models";
import responses from "./responses";

export const getCustomResponse = (url, scenarios) => {
  if (!scenarios || scenarios.length === 0) return null;
  console.log(scenarios)
  return responses.find(
    (response) =>
      scenarios.includes(response.code) && response.urls.includes(url)
  );
};

export const toQuoteSummary = (quote) => ({
  id: quote.id,
  scenarios: quote.scenarios,
  quoteNumber: quote.quoteNumber,
  statusCode: quote.statusCode,
  lastModifiedAt: quote.lastModifiedAt,
  customerName: quote.customer && quote.customer.name,
  mobilePhoneDescription: quote.mobilePhone && quote.mobilePhone.serialNo,
});

export const removeTrailingSlashes = (url) => url.replace(/\/+$/, "");

export const getScenariosApplicableToEndpoint = (
  endpoint: string,
  scenarios: string[]
) => {
  const endpointScenarios = (scenariosForEndpoint[endpoint] as string[]) || [];
  return scenarios.filter((a) => endpointScenarios.includes(a));
};
