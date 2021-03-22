import jsonServer from 'json-server';
import data from './mockData';
import * as renderHelpers from './renderHelpers';
import { getScenariosApplicableToEndpoint } from './renderHelpers';

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

// @ts-ignore
router.render = (req, res) => {
  console.log('=========== req.headers[scenarios]',req.headers['scenarios'])
  const scenariosHeaderString = req.headers['scenarios'];
  const scenariosFromHeader = scenariosHeaderString
    ? scenariosHeaderString.split(' ')
    : [];
  const url = renderHelpers.removeTrailingSlashes(req._parsedOriginalUrl.path);
  console.log(req._parsedOriginalUrl.path)

  let customResponse = renderHelpers.getCustomResponse(url, scenariosFromHeader);

  if (customResponse) {
    res.status(customResponse.httpStatus).jsonp(customResponse.response);
  } else {
    let data = res.locals.data;

    if (url === 'api/quotes' && req.method === 'GET') {
      data = data.map(renderHelpers.toQuoteSummary);
    }
    console.log('===scenariosHeaderString,', scenariosHeaderString)
    if (scenariosHeaderString && Array.isArray(data) && data.length > 0) {
      const scenariosApplicableToEndPoint = getScenariosApplicableToEndpoint(
        url,
        scenariosFromHeader
      );
      console.log('===scenariosApplicableToEndPoint; ',scenariosApplicableToEndPoint)
      const filteredByScenario = data.filter((d) =>
        scenariosApplicableToEndPoint.every(
          (scenario) => d.scenarios && d.scenarios.includes(scenario)
        )
      );
      //console.log('=== filteredByScenario', filteredByScenario)
      return res.jsonp(filteredByScenario);
    } else {
      return res.jsonp(data);
    }
  }
};

server.use(router);

server.listen(5000, () => {
  console.log('JSON Server is running');
});
