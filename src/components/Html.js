import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import config from '../config';

/* eslint-disable react/no-danger */

class Html extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    style: PropTypes.string,
    scripts: PropTypes.arrayOf(PropTypes.string.isRequired),
    app: PropTypes.object, // eslint-disable-line
    children: PropTypes.string.isRequired,
  };

  static defaultProps = {
    scripts: [],
    style: '',
  };

  render() {
    const { title, description, style, scripts, app, children } = this.props;
    return (
      <html className="no-js" lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <title>
            <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
          </title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {scripts.map(script =>
            <link key={script} rel="preload" href={script} as="script" />,
          )}
          <link rel="apple-touch-icon" href="apple-touch-icon.png" />
          <style dangerouslySetInnerHTML={{ __html: style }} />
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
          <script
            dangerouslySetInnerHTML={{ __html: `window.App=${serialize(app)}` }}
          />
          {scripts.map(script => <script key={script} src={script} />)}
          {config.analytics.googleTrackingId &&
            <script
              dangerouslySetInnerHTML={{
                __html:
                  'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' +
                  `ga('create','${config.analytics
                    .googleTrackingId}','auto');ga('send','pageview')`,
              }}
            />}
          {config.analytics.googleTrackingId &&
            <script
              src="https://www.google-analytics.com/analytics.js"
              async
              defer
            />}
        </body>
      </html>
    );
  }
}

export default Html;
