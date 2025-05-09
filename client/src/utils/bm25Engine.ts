import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
const bm25Factory = require('wink-bm25-text-search');

const nlp = winkNLP(model);
const its = nlp.its;

function prepTask(text: string): string[] {
  const tokens: string[] = [];
  nlp
    .readDoc(text)
    .tokens()
    .filter(t => t.out(its.type) === 'word' && !t.out(its.stopWordFlag))
    .each((t: any) => {
      const stem = t.out(its.stem) as string;
      tokens.push(t.out(its.negationFlag) ? '!' + stem : stem);
    });
  return tokens;
}

/**
 * Build a fresh BM25 engine indexing both address & description.
 * @param docs – array of objects `{ address, description }`
 */
export function buildBm25Engine(
  docs: Array<{ address: string; description: string }>
) {
  const engine = bm25Factory();

  // ← Give each field a weight (tweak bellow as you see fit)
  engine.defineConfig({
    fldWeights: {
      address:      1,   // lower weight on address
      description:  2    // higher weight on description
    }
  });

  engine.definePrepTasks([prepTask]);

  docs.forEach((doc, i) => {
    // ← pass both fields to BM25
    engine.addDoc(
      { address: doc.address, description: doc.description },
      i
    );
  });

  engine.consolidate();
  return engine;
}