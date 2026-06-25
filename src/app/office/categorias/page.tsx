import AuthGuard from "@/components/office/AuthGuard"
import ComingSoon from "@/components/office/ComingSoon"

function CategoriasPage(): React.JSX.Element {
  return (
    <AuthGuard>
      <ComingSoon title="Categorías" icon="🏷️" />
    </AuthGuard>
  )
}

export default CategoriasPage
