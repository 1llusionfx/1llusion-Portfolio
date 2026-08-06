import React from "react"

/**
 * Renders `text`, swapping every occurrence of `accent` for serif italic.
 * Used for headings like "let's *build* something".
 */
export function SerifAccent({
  text,
  accent,
}: {
  text: string
  accent?: string
}) {
  if (!accent) return <>{text}</>

  const parts = text.split(accent)
  if (parts.length === 1) return <>{text}</>

  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 ? (
            <span className="font-serif font-normal italic">{accent}</span>
          ) : null}
        </React.Fragment>
      ))}
    </>
  )
}
