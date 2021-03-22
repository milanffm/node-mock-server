import { QuoteDto } from "api-models";

export const scenariosForEndpoint = {
  "/api/quotes": ["phone", "no-phone", "draft", "open", "no-quotes"],
  "/api/users": ["admin", "salesrep", "no-user"],
};

export type QuoteScenario =
  | "phone"
  | "no-phone"
  | "draft"
  | "open"
  | "no-quotes";

export interface QuoteDtoSceanrio extends QuoteDto {
  scenarios: QuoteScenario[];
}
