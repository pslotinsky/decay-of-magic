export default {
  layers: [
    { title: 'Api', root: 'src/api', renderer: 'api' },
    { title: 'Application', root: 'src/application', renderer: 'application' },
    { title: 'Domain', root: 'src/domain', renderer: 'domain' },
    {
      title: 'Infrastructure',
      root: 'src/infrastructure',
      renderer: 'infrastructure',
    },
  ],
};
