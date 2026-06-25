import AuthGuard from "@/components/office/AuthGuard"
import ComingSoon from "@/components/office/ComingSoon"

function TestimoniosPage(): React.JSX.Element {
  return (
    <AuthGuard>
      <ComingSoon title="Testimonios" icon="⭐" />
    </AuthGuard>
  )
}

export default TestimoniosPage
