/** @jsx jsx */
import NextLink from 'next/link';
import { jsx, Link as A } from 'theme-ui';

export function Link({ path, label, children, ...rest }) {
  return (
    <NextLink href={path}>
      <A {...rest}>{children ? children : label}</A>
    </NextLink>
  );
}