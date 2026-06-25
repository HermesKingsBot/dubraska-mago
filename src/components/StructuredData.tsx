interface StructuredDataProps {
  data: Record<string, unknown>
}

function StructuredData({ data }: StructuredDataProps): React.JSX.Element {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export default StructuredData
