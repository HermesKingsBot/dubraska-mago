interface CanonicalLinkProps {
  path: string
}

function CanonicalLink({ path }: CanonicalLinkProps): React.JSX.Element | null {
  const baseUrl = "https://dubraska-mago.vercel.app"

  return <link rel="canonical" href={`${baseUrl}${path}`} />
}

export default CanonicalLink
