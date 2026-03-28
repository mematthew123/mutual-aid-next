import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "@portabletext/react";
import { sanityImageUrl } from "@/lib/sanity/image";

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-stone-800 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-stone-800 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-stone-800 mb-3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold text-stone-800 mb-2">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="text-stone-600 text-base/7 mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-forest-500 pl-4 py-2 mb-4 bg-sage-50 rounded-r-lg italic text-stone-600">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          className="text-forest-600 hover:text-forest-700 underline underline-offset-2"
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-4 flex flex-col gap-1 text-stone-600">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4 flex flex-col gap-1 text-stone-600">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="text-base/7">{children}</li>,
    number: ({ children }) => <li className="text-base/7">{children}</li>,
  },
  types: {
    image: ({ value }) => {
      const url = sanityImageUrl(value);
      if (!url) return null;
      return (
        <figure className="my-6">
          <img
            src={url}
            alt={value?.alt || ""}
            className="w-full rounded-xl"
          />
          {value?.caption && (
            <figcaption className="text-sm text-stone-500 mt-2 text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

interface PortableTextRendererProps {
  value: unknown[];
  className?: string;
}

export function PortableTextRenderer({
  value,
  className,
}: PortableTextRendererProps) {
  if (!value || value.length === 0) return null;

  return (
    <div className={className}>
      <PortableText
        value={value as PortableTextBlock[]}
        components={components}
      />
    </div>
  );
}
