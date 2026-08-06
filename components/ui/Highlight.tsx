import React from "react"

/**
 * Renders `text`, emphasising every listed term. Terms must appear verbatim
 * in the text; anything that doesn't match is left alone.
 */
export function Highlight({
  text,
  terms,
}: {
  text: string
  terms: readonly string[]
}) {
  if (terms.length === 0) return <>{text}</>

  const pattern = new RegExp(
    `(${terms.map(escapeRegExp).join("|")})`,
    "gi"
  )
  const parts = text.split(pattern)

  return (
    <>
      {parts.map((part, i) =>
        terms.some((term) => term.toLowerCase() === part.toLowerCase()) ? (
          <strong key={i} className="font-semibold text-fg">
            {part}
          </strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  )
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
