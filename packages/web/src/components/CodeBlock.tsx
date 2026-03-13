import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Copy, Check } from "lucide-react";

const LANG_MAP: Record<string, string> = {
  tsx: "tsx",
  jsx: "jsx",
  ts: "typescript",
  js: "javascript",
  vue: "markup",
  html: "markup",
  bash: "bash",
  sh: "bash",
  css: "css",
};

export function CodeBlock({ code, lang = "tsx" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const prismLang = LANG_MAP[lang] || lang;

  return (
    <div className="relative bg-slate-900/80 rounded-xl my-4 overflow-hidden">
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
      >
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      </button>
      <Highlight theme={themes.nightOwl} code={code.trim()} language={prismLang}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="p-4 overflow-x-auto text-xs leading-relaxed">
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
