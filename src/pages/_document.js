import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <div id="backdrop-hook"></div>
          {/* <div id="modal-hook"></div> */}
          <div id="drawer-hook"></div>
          <div id="notification-hook"></div>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
