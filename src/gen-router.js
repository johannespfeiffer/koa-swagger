import routington from 'routington';

/**
 * Generates the checking router from the swagger def
 * @param def {Swagger} The swagger complete definition
 * @return {routington} A router
 */
export default function(def) {
  const paths = def.paths;
  const base = def.basePath || '';

  const router = routington();
  Object.keys(paths).forEach((route) => {
    const node = router.define(base + route.replace(/{([^}]*)}/g, ':$1'))[0];
    node.def = paths[route];
  });
  return router;
}
