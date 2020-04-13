import React from 'react';

interface Props {
  title?: string;
  onClean?(): void;
}

class Layout extends React.Component<Props> {
  render() {
    const withCleanButton = this.props.onClean ? (
      <span className="button is-pulled-right" onClick={this.props.onClean}>
        Clean
      </span>
    ) : null;

    const withTitle = this.props.title ? (
      <section className="hero is-light">
        <div className="hero-body">
          <div className="container">
            {withCleanButton}
            <div className="columns">
              <div className="column has-text-centered">
                <h1 className="title">{this.props.title}</h1>
              </div>
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
            <a href="https://vulpem.com">© Vulpem Ventures OU</a>
          </p>
        </footer>
      </div>
    );
  }
}

export default Layout;
