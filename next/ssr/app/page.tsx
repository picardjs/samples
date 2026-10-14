import { Suspense } from "react";
import { PicardComponent } from "@/lib/picard";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Next.js</h1>
        <div className={styles.row}>
          <div className={styles.col}>
            <h3>Static Column 1</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</p>
          </div>
          <div className={styles.col}>
            <Suspense>
              <PicardComponent name="column" source="mf-simple-html" server="none" />
            </Suspense>
          </div>
          <div className={styles.col}>
            <Suspense>
              <PicardComponent name="column" source="nfsimplehtml" server="none" />
            </Suspense>
          </div>
        </div>
        <Suspense>
          <PicardComponent name="counter" source="pi-simple-html" server="none" />
        </Suspense>
        <Suspense fallback={<p>Loading...</p>}>
          {/* rendered on the server and hydrated in the browser */}
          <PicardComponent name="ssr-counter" source="pi-ssr-html" data={{ start: 5 }} />
        </Suspense>
      </main>
    </div>
  );
}
