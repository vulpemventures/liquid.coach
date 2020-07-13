import React from 'react';

interface Props {
  title?: string;
  onClean?(): void;
  onExplorer?(explorer: string): void;
  showExplorer: boolean;
}

class Layout extends React.Component<Props> {
  changeUrl() {
    const errorMsg = 'Not valid endpoint';
    let url = prompt('Custom Electrs REST endpoint to use');
    try {
      if (!url || typeof url != 'string' || url.length <= 0) {
        throw new Error();
      }
      new URL(url!);
      if (url.includes('localhost')) url = `http://${url}`;
      this.props.onExplorer!(url!);
    } catch (ignore) {
      alert(errorMsg);
    }
  }

  render() {
    const withCleanButton = this.props.onClean ? (
      <span className="button is-pulled-right" onClick={this.props.onClean}>
        Reset
      </span>
    ) : null;

    const withExplorer = this.props.showExplorer ? (
      <span className="button is-pulled-right" onClick={() => this.changeUrl()}>
        Custom explorer
      </span>
    ) : null;

    const withTitle = this.props.title ? (
      <section className="hero is-light">
        <div className="hero-body">
          <div className="container">
            <div className="columns">
              <div className="column is-8 is-offset-2 has-text-centered">
                <h1 className="title">{this.props.title}</h1>
              </div>
              <div className="column has-text-centered">{withExplorer}</div>
              <div className="column has-text-centered">{withCleanButton}</div>
            </div>
          </div>
        </div>
      </section>
    ) : null;

    return (
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        {withTitle}
        <div
          style={{
            paddingTop: '5rem',
            paddingRight: '1rem',
            paddingLeft: '1rem',
            paddingBottom: '5rem',
          }}
        >
          {this.props.children}
        </div>
        <footer
          style={{
            position: 'absolute',
            bottom: 0,
            height: '5rem',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <p>
            <a
              href="https://vulpem.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              © Vulpem Ventures OU
            </a>
          </p>
        </footer>
      </div>
    );
  }
}

export default Layout;
