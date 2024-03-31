import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Button } from "../components/ui/button"
import Deployer from "@/page";


const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Token Deployer</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <Deployer/>
      </main>

    </div>
  );
};

export default Home;
