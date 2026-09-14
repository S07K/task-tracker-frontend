import React from "react";
import { Box, Link } from "@chakra-ui/react";
import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Raw HTML in replies is never rendered (react-markdown escapes it), and unsafe
// link protocols like javascript: are stripped by its default URL transform.
const components: Components = {
  a: ({ href, title, children }) => (
    <Link href={href} title={title} isExternal color="gray.900" textDecoration="underline">
      {children}
    </Link>
  ),
};

/** Renders an assistant reply's Markdown with compact chat-bubble styling. */
const AssistantMarkdown: React.FC<{ content: string }> = ({ content }) => (
  <Box
    sx={{
      "& > :first-of-type": { mt: 0 },
      "& > :last-child": { mb: 0 },
      p: { my: 2 },
      "ul, ol": { my: 2, pl: 5 },
      li: { my: 0.5 },
      "li > p": { my: 0 },
      "h1, h2, h3, h4": { fontWeight: 600, fontSize: "sm", mt: 3, mb: 1 },
      strong: { fontWeight: 600 },
      code: { fontFamily: "mono", fontSize: "xs", bg: "blackAlpha.100", px: 1, py: 0.5, borderRadius: "sm" },
      pre: { my: 2, p: 2.5, bg: "blackAlpha.100", borderRadius: "md", overflowX: "auto" },
      "pre code": { bg: "transparent", p: 0 },
      blockquote: { my: 2, pl: 3, borderLeft: "2px solid", borderColor: "gray.300", color: "gray.600" },
      hr: { my: 3, borderColor: "gray.300" },
      table: { my: 2, display: "block", overflowX: "auto", borderCollapse: "collapse", fontSize: "xs" },
      "th, td": { border: "1px solid", borderColor: "gray.300", px: 2, py: 1, textAlign: "left" },
      th: { bg: "blackAlpha.50", fontWeight: 600 },
    }}
  >
    <Markdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </Markdown>
  </Box>
);

export default AssistantMarkdown;
