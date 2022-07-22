import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Welcome to something-shop!</title>
            </Head>
            <main className="app">
                <Component {...pageProps} />
            </main>
        </>
    );
}

export default CustomApp;
