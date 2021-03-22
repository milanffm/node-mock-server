import jsonServer from 'json-server';
import data from './mockData';
import * as renderHelpers from './renderHelpers';
import { getScenariosApplicableToEndpoint } from './renderHelpers';
const port = process.env.PORT || 5000;
//const development = process.env.NODE_ENV === 'development';

const server = jsonServer.create();
const router = jsonServer.router(data);
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use(
    jsonServer.rewriter({
      '/api/*': '/$1',
      '/users/me': '/user',
    })
);

/**
 * return faked api data depends on request
 * @param req
 * @param res
 */
// @ts-ignore
router.render = (req, res) => {
  console.log('=========== req.headers[scenarios]',req.headers['scenarios'])
  const scenariosHeaderString = req.headers['scenarios'];
  const scenariosFromHeader = scenariosHeaderString
      ? scenariosHeaderString.split(' ')
      : [];

  //Todo find a way to get always the current path from jsonServer
  const url = renderHelpers.removeTrailingSlashes(req._parsedOriginalUrl ? req._parsedOriginalUrl.path : req.originalUrl);

  let customResponse = renderHelpers.getCustomResponse(url, scenariosFromHeader);

  /** if scenario === 'error' return custom error response **/
  if (customResponse) {
    res.status(customResponse.httpStatus).jsonp(customResponse.response);
  } else {
    let data = res.locals.data;

    if (url === 'api/quotes' && req.method === 'GET') {
      data = data.map(renderHelpers.toQuoteSummary);
    }

    if (scenariosHeaderString && Array.isArray(data) && data.length > 0) {
      const scenariosApplicableToEndPoint = getScenariosApplicableToEndpoint(
          url,
          scenariosFromHeader
      );
      const filteredByScenario = data.filter((d) =>
          scenariosApplicableToEndPoint.every(
              (scenario) => d.scenarios && d.scenarios.includes(scenario)
          )
      );
      /** return json or array filtered by given scenario **/
      return res.jsonp(filteredByScenario);
    } else {
      /** return unfiltered fake data for given url **/
      return res.jsonp(data);
    }
  }
};

server.use(router);

server.listen(port, () => {
  console.log(`================================\nJSON Server is running on: \nhttp://localhost:${port}\n================================\n`);
});
