import React from 'react';
import Head from 'next/head';

export default function SEO({
  title = 'Free summarize Tool',
}) {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
};
